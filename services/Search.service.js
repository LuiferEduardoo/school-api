const { sequelize } = require('./../libs/sequelize');
const Transactional = require('./Transactional.service');

class Search extends Transactional {
    async get (req){
        return this.withTransaction(async (transaction) => {
            const where = this.checkPermissionToGet(req)
            const query = this.queryParameter(req.query);
            const includePublication = [
                { association: 'publication', where: where, order: this.order, include: [
                    {association: 'categories', include:[{association: 'categories', include: 'clasification'}]},
                    {association:'subcategories', include:[{association: 'subcategories', include: 'clasification'}]},
                    {association:'tags', include:[{association: 'tags', include: 'clasification'}]}
                ]}
            ];
            const { term } = req.query;
            const searchData = [
                { model: sequelize.models.AcademicLevels, fields: ['nameLevel', 'levelCode', '$modality.modality$'], include: ['modality'], where: where },
                { model: sequelize.models.InstitutionalProjects, fields: ['title', '$categories.categories.clasification.name$', '$subcategories.subcategories.clasification.name$', '$tags.tags.clasification.name$'], include: this.includeClassification, where: where},
                { model: sequelize.models.NewsPublications, fields: ['$publication.title$', '$publication.categories.categories.clasification.name$', '$publication.subcategories.subcategories.clasification.name$', '$publication.tags.tags.clasification.name$'], include: includePublication },
                { model: sequelize.models.InstitutionalProjectsPublications, fields: ['$publication.title$', '$publication.categories.categories.clasification.name$', '$publication.subcategories.subcategories.clasification.name$', '$publication.tags.tags.clasification.name$'], include: includePublication }
            ];
            const results = await Promise.all(searchData.map(async ({ model, fields, include, where }) => {
                const whereClause = {};
                this.querySearch(fields, term, whereClause);
                const data = await model.findAll({ where: {...whereClause, ...where}, include: include, ...query });
                return data;
            }));
            return results.flat();
        });
    }
}

module.exports = Search;