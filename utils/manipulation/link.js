const cleanAndLowercase = require('./cleanAndLowercase');
const slugify = require('slugify');

const generateLink = async (title, model, sequelize) => {
    const cleanTitle = cleanAndLowercase(title);
    let link = slugify(cleanTitle);
    const baseLink = link;
    let counter = 1;

    while (true) {
        const existingPublication = await sequelize.models[model].findOne({ where: { link } });

        if (!existingPublication || existingPublication.id === this.id) {
            // Si no hay publicación con este enlace o si esta publicación ya tiene este enlace, es único
            break;
        }

        link = `${baseLink}-${counter}`;
        counter++;
    }
    return link
}

module.exports = generateLink;
