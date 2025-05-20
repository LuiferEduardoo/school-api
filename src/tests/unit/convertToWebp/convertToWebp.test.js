const { convertToWebP } = require('../../../libs/sharp');
const sharp = require('sharp');

jest.mock('sharp', () => {
    const mockSharpInstance = {
        toFormat: jest.fn().mockReturnThis(),
        toBuffer: jest.fn().mockResolvedValue(Buffer.from('mocked webp buffer'))
    };

    const mockSharp = jest.fn(() => mockSharpInstance);
    return mockSharp;
});

describe('convertToWebP', () => {
    test('should convert image buffer to WebP', async () => {
        const imageBuffer = Buffer.from('image buffer');

        const result = await convertToWebP(imageBuffer);

        // Verificar que sharp haya sido llamado con los parámetros correctos
        expect(sharp).toHaveBeenCalledWith(imageBuffer);
        expect(sharp().toFormat).toHaveBeenCalledWith('webp');
        expect(sharp().toBuffer).toHaveBeenCalled();

        // Verificar el resultado
        expect(result).toEqual(Buffer.from('mocked webp buffer'));
    });

    test('should throw an error if conversion fails', async () => {
        sharp().toBuffer.mockRejectedValueOnce(new Error('Conversion error'));

        const imageBuffer = Buffer.from('image buffer');

        // Llamar a la función convertToWebP y verificar que lance un error
        await expect(convertToWebP(imageBuffer)).rejects.toThrow('Error al convertir a WebP');
    });
});
