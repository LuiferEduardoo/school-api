const fileGenerator = require('./fileGenerator');

async function uploadFile(token, fileType, isPublic = true ) {

    let fileBuffer;
    if (fileType === 'image') {
        fileBuffer = await fileGenerator('image');
    } else if (fileType === 'document') {
        fileBuffer = await fileGenerator('document');
    } else {
        throw new Error('Tipo de archivo no válido');
    }

    return await request
        .post('/api/v1/file/upload')
        .set('Authorization', `Bearer ${token}`)
        .field('folder', 'exampleFolder')
        .field('fileType', fileType)
        .field('isPublic', isPublic)
        .field('imageCredits', 'John Doe')
        .attach('files', fileBuffer, fileType === 'image' ? 'fake-image.png' : 'fake-document.pdf');
}

async function uploadFilesForUser(token, isPublic) {
    await uploadFile(token, 'image', isPublic);
    await uploadFile(token, 'document', isPublic);
}

module.exports = { uploadFile, uploadFilesForUser }