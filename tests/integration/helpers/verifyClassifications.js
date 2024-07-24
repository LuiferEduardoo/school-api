const verifyClassifications = (classificationsList, newClassification, classificationDelete) => {
    let dataToReturn = {
        isElementDelete: false,
        isNewClassification: false
    };
    classificationsList.forEach(classification => {
        if(classification === classificationDelete){
            dataToReturn.isElementDelete = true;
        }
        if(classification === newClassification){
            dataToReturn.isNewClassification = true;
        }
    });

    return dataToReturn
};

module.exports = verifyClassifications