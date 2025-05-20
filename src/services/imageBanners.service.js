const { sequelize } = require('./../libs/sequelize');
const ImageAssociation = require('./imageAssociation.service');
const Transactional = require('./Transactional.service');

const serviceImageAssociation = new ImageAssociation();

class ImageBanners extends Transactional {
    async get(id, banner, req){
        try {
            const include = [{ association: 'imageBanner', include: [{ association: 'image', include: 'file' }] }]
            await this.checkModel(banner, 'Banner')
            if(id){
                return await this.getElementWithCondicional(banner, include, {id: id})
            }
            return await this.getAllElementsWithoutQuery(banner, include)
        } catch(error){
            throw error
        }
    }

    async getAll(req){
        try{
            const banners = [{
                title: "Banner Home",
                endpoint: 'BannersHome',
                description: "Bannner principal que se visualiza en la página de inicio, capturando la atención del visitante con contenido relevante y atractivo.",
            },
            {
                title: "Banner Nuestra Escuela",
                endpoint: 'BannersOurSchool',
                description: "Destaca los aspectos más destacados y distintivos de nuestra institución educativa, ofreciendo una visión única de lo que somos y lo que ofrecemos.",
            },
            {
                title: "Banner Proyectos Institucionales",
                endpoint: 'BannersInstitutionalProjects',
                description: "Muestra nuestras iniciativas clave y proyectos en desarrollo, reflejando nuestro compromiso con la innovación y la excelencia educativa.",
            },
            {
                title: "Banner Niveles Académicos",
                endpoint: 'BannersAcademicLevels',
                description: "Ofrece una visión general de los diversos niveles de educación que ofrecemos, desde preescolar hasta educación superior, destacando nuestras fortalezas en cada etapa del aprendizaje.",
            },
            {
                title: "Banner Noticias",
                endpoint: 'BannersNews',
                description: "Mantiene a nuestra comunidad informada sobre las últimas novedades, eventos y logros destacados dentro de nuestra institución educativa y más allá.",
            },
            {
                title: "Banner Admisiones",
                endpoint: 'BannersAdmissions',
                description: "Proporciona información crucial para aquellos interesados en unirse a nuestra comunidad educativa, detallando los procesos de admisión, fechas importantes y requisitos.",
            },
            {
                title: "Banner Contacto",
                endpoint: 'BannersContact',
                description: "Facilita el acceso directo a nuestras vías de comunicación, brindando a nuestros visitantes la oportunidad de ponerse en contacto con nosotros de manera rápida y sencilla.",
            }];
            const response = [];
            for (let index = 0; index < banners.length; index++) {
                const banner = await this.get(null, banners[index].endpoint);
                const data = {
                    title: banners[index].title,
                    endpoit: banners[index].endpoint,
                    description: banners[index].description,
                    banners: banner
                }
                response.push(data);
            }
            return response
        } catch(error){
            throw error
        }
    }
    async create(req, data, banner){
        return this.withTransaction(async (transaction) => {
            await this.checkModel(banner, 'Banner');
            const createImages = await serviceImageAssociation.createOrAdd(req, 'ImageBanners', {userId: req.user.sub}, `banners/${banner}`, data.ids, transaction);
            const description = data.description ? data.description.split(",") : [];
            const imagesBanner = [];
    
            let counter = 0;
            for (const createImage of createImages) {
                    imagesBanner.push(await sequelize.models[banner].create({
                    bannerId: createImage.id,
                    description: description[counter] 
                }, { transaction }));
                counter ++;
            }
            return imagesBanner;
        })
    }
    async update(req, data, banner){
        return this.withTransaction(async (transaction) => {
            await this.checkModel(banner, 'Banner');
            const updateBanner = [];
            const idsBanner = data.idsBanners ? data.idsBanners.split(',').map(id => parseInt(id, 10)) : [];
            const descriptions = data.description ? data.description.split(',') : [];
            const bannerForId = []
            
            let counter = 0;
            for (const idBanner of idsBanner ){
                const imageBanner = await this.getElementById(idBanner, banner);
                bannerForId.push(imageBanner.bannerId);
                const dataUpdateInDataBase = {};
                if(descriptions[counter] != null){
                    dataUpdateInDataBase.description = descriptions[counter]
                }
                updateBanner.push(await imageBanner.update(dataUpdateInDataBase));
                counter ++;
            }
            return updateBanner;
        })
    }
    async delete(req, data, banner){
        return this.withTransaction(async (transaction) => {
            await this.checkModel(banner, 'Banner');
            const eliminateBannersIds = data.idsBanners.split(",");
            let bannersToDelete = [];
            let imagesToDeleteAssociation = [];
            for(const eliminateBannerId of eliminateBannersIds){
                const bannerToDelete = await this.getElementById(eliminateBannerId, banner);
                imagesToDeleteAssociation.push(bannerToDelete.bannerId);
                await bannerToDelete.destroy();
                bannersToDelete.push(bannerToDelete);
            }
            await serviceImageAssociation.delete(imagesToDeleteAssociation, 'ImageBanners', data.elimianteImages, req, { transaction });
            return {
                message: "banner borrado con exito",
                ids: eliminateBannersIds
            }
        });
    }
}

module.exports = ImageBanners;