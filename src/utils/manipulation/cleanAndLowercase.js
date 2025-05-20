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

module.exports = cleanAndLowercase;