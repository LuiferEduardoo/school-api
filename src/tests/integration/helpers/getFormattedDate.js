const getFormattedDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Los meses en JavaScript son indexados desde 0, por eso sumamos 1

    return `${year}/${month}`;
};

module.exports = getFormattedDate