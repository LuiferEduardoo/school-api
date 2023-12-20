const slugify = require('slugify');

const cleanAndLowercase = (text) => {
    // Reemplazar caracteres especiales y convertir a minúsculas
    const cleanText = text
        .normalize("NFD") // Normalizar para separar tildes y letras
        .replace(/[\u0300-\u036f]/g, "") // Remover tildes
        .replace(/ñ/gi, "n") // Reemplazar ñ con n
        .replace(/[^\w\s]/gi, '') // Remover caracteres especiales
        .toLowerCase(); // Convertir a minúsculas
        
    return cleanText;
};

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
