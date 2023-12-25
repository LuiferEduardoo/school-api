const { sequelize } = require('./../libs/sequelize');
const Transactional = require('./Transactional.service');
const boom = require('@hapi/boom');

const Classification = require('./classification.service');

const serviceClassification = new Classification();

class ClassificationAssociation extends Transactional {
    async createTypeClassificationAssociation(name, modelTypeClassification, transaction){
        try {
            const createClassification = await serviceClassification.createClassification(name); // Se crea la clasificación
            await this.checkModel(modelTypeClassification, 'Tipo de clasificación');
            const createTypeClassificaction = await sequelize.models[modelTypeClassification].findOrCreate({
                where: { clasificationId: createClassification.id},
                transaction: transaction
            }); // Se crea o se busca el tipo de clasficiación si ya es creada
            return createTypeClassificaction[0];
        } catch (error) {
            throw error
        }
    }

    async deleteTypeClassificationAssociation (id, modelClassificationElement, fieldNameElement, elementId, transaction){
        try{
            const classificationToDelete = await serviceClassification.getClassification(modelClassificationElement, id);
            if(classificationToDelete[fieldNameElement] != elementId){
                throw boom.unauthorized();
            }
            await classificationToDelete.destroy({transaction});
            return classificationToDelete;
        }catch(error){
            throw error;
        }
    }

    async deleteTypeClassification (typesClassificationsToDelete, transaction){
        try {
            for(const typeClassificationToDelete of typesClassificationsToDelete){
                const deleteTypeClassification = await typeClassificationToDelete.destroy({transaction});
                const deleteClassification = await serviceClassification.deleteClassification(typeClassificationToDelete.clasificationId, transaction);
            }
        } catch (error) {

        }
    }

    createCategoryObjects(data, classification) {
        const array = Array.isArray(data) ? data : data.split(",");
        return array.map(item => ({
            name: typeof item === 'string' ? item.trim() : item,
            modelTypeClassifications: classification
        }));
    }

    async createClassificationOfModel(categories, subcategories, tags, modelClassificationsElement, element, transaction){
        try{
            const categoriesArray = categories ? this.createCategoryObjects(categories, 'Categories') : [];
            const subcategoriesArray = subcategories ? this.createCategoryObjects(subcategories, 'Subcategories'): [];
            const tagsArray = tags ? this.createCategoryObjects(tags, 'Tags'): [];
            const classifications = [...categoriesArray, ...subcategoriesArray, ...tagsArray];
        
            const createClassificationOfModel = [];
            let counter;
            for(const classification of classifications){
                const createTypeClassificaction = await this.createTypeClassificationAssociation(classification.name, classification.modelTypeClassifications, transaction);
                const typeClassification = classification.modelTypeClassifications === 'Categories' ? 'categoryId' : classification.modelTypeClassifications === 'Subcategories' ? 'subcategoryId' : 'tagId';
                const createClassificationElement = await sequelize.models[`${classification.modelTypeClassifications}${modelClassificationsElement}`].findOrCreate({
                    where: {
                        [typeClassification]: createTypeClassificaction.id,
                        ...element
                    },
                    defaults: {
                        ...element
                    },
                    transaction
                });
                createClassificationOfModel.push(createClassificationElement[0]);
                counter++;
            }
            return createClassificationOfModel;

        }catch(error){
            throw error;
        }
    }
    async deleteClassificationOfModel(idsEliminateCategories, idsEliminateSubcategories, idsEliminateTags, modelClassificationsElement, transaction, elementId , fieldNameElement, deleteAll=false){
        try{
            const classificationOfModelDelete =[]
            const typeClassificationToDeleteArray = []
            const classifications = ['Categories', 'Subcategories', 'Tags'];

            const idsToAssign = {
                Categories: idsEliminateCategories,
                Subcategories: idsEliminateSubcategories,
                Tags: idsEliminateTags
            };
            if(deleteAll){ // Verificamos si se tienen que borrar todas las clasificaciones
                for (let i = 0; i < classifications.length; i++) {
                    const classification = classifications[i];
                    const getElementClassificationToDelete = await serviceClassification.getClassification(modelClassificationsElement, elementId, [{ association: `${classification.toLowerCase()}`, include: `${classification.toLowerCase()}` }]);
                    const ids = getElementClassificationToDelete[`${classification.toLowerCase()}`].map(classif => classif.id);

                    idsToAssign[classification] = ids; // Reasignar los parámetros basados en el índice de la clasificación
                }                
            }
            const categoriesArray = idsToAssign.Categories ? this.createCategoryObjects(idsToAssign.Categories, classifications[0]) : [];
            const subcategoriesArray = idsToAssign.Subcategories ? this.createCategoryObjects(idsToAssign.Subcategories, classifications[1]) : [];
            const tagsArray = idsToAssign.Tags ? this.createCategoryObjects(idsToAssign.Tags, classifications[2]) : [];
            const idsEliminate = [...categoriesArray, ...subcategoriesArray, ...tagsArray];
            for(const idEliminate of idsEliminate){
                const classificationToDelete = await this.deleteTypeClassificationAssociation(idEliminate.name, `${idEliminate.modelTypeClassifications}${modelClassificationsElement}`, fieldNameElement, elementId, transaction); // Borramos los tipos de clasificaciones de la asociación
                const idTypeClassificationToDelete = classificationToDelete.categoryId || classificationToDelete.subcategoryId || classificationToDelete.tagId;
                typeClassificationToDeleteArray.push(await serviceClassification.getClassification(idEliminate.modelTypeClassifications, idTypeClassificationToDelete));
            }
            classificationOfModelDelete.push(idsEliminate)
        
            this.withTransaction(async (transaction) => {
                await this.deleteTypeClassification(typeClassificationToDeleteArray, transaction); // Borramos los tipos de clasificación y la clasificación si no tiene relaciones
            })
            return classificationOfModelDelete;
        }catch(error){
            throw error;
        }
    }

    async updateClassificationModelType(categories, subcategories, tags, idsEliminateCategories, idsEliminateSubcategories, idsEliminateTags, modelClassificationsElement, element, elementId, transaction){
        try {
            if(idsEliminateCategories || idsEliminateSubcategories || idsEliminateTags){
                await this.deleteClassificationOfModel(idsEliminateCategories, idsEliminateSubcategories, idsEliminateTags, modelClassificationsElement, transaction, elementId)
            } 
            if(categories || subcategories || tags){
                await this.createClassificationOfModel(categories, subcategories, tags, modelClassificationsElement, element, transaction)
            }
        } catch (error) {
            throw error   
        }
    }
}

module.exports = ClassificationAssociation;