const path = require('path');
const boom = require('@hapi/boom');
const fs = require('fs');
jest.mock('fs');
const SaveFileInServer = require('../../../services/saveFileInServer.service'); // Ajusta la ruta al controlador

describe('updateFileInServer', () => {
    beforeEach(() => {
        fileService = new SaveFileInServer();
        mockRequest = {
          files: {
            files: [
              {
                name: 'testImage.png',
                type: 'image/png',
                size: 12345,
              },
            ],
          },
          user: {
            sub: '123',
          },
          protocol: 'http',
          get: jest.fn().mockReturnValue('localhost:3000')
        };
      });

    test('should update file correctly with new name and folder', async () => {
      const data = {
        path: 'uploads/image/123/2024/07/testImage.png',
        newName: 'newTestImage',
        newFolder: 'newTestFolder',
        fileType: 'image',
        isPublic: true
      };
      
      mockRequest.files = null;
      
      fs.existsSync.mockReturnValue(true);
      fs.rename.mockImplementation((oldPath, newPath, callback) => callback(null));
  
      fileService.getUniqueFilename = jest.fn().mockReturnValue({ fileName: 'newTestImage.png' });
      fileService.createFolder = jest.fn();
      fileService.baseUrl = jest.fn().mockReturnValue('http://localhost:3000');
  
      const result = await fileService.updateFileInServer(data, mockRequest);
  
      expect(result).toEqual({
        name: 'newTestImage.png',
        url: 'http://localhost:3000/uploads/image/newTestFolder/123/2024/07/newTestImage.png',
        folder: '/uploads/image/newTestFolder/123/2024/07',
        isPublic: true
      });
    });
    
    test('should update file with new uploaded file', async () => {
      const data = {
        path: 'uploads/image/123/2024/07/oldImage.png',
        folder: '/uploads/image/123/2024/07',
        fileType: 'image',
        isPublic: true
      };

      const newFile = {
        name: 'newImage.png',
        type: 'image/png',
        size: 12345
      };

      mockRequest.files = {
        files: newFile
      };

      fileService.uploadFileInServer = jest.fn().mockResolvedValue({
        uniqueFilePath: {
          fileName: 'newImage.png',
          ext: '.png'
        },
        width: 800,
        height: 600,
        fileType: 'image'
      });

      fileService.baseUrl = jest.fn().mockReturnValue('http://localhost:3000');

      const result = await fileService.updateFileInServer(data, mockRequest);

      expect(result).toEqual({
        name: 'newImage.png',
        url: 'http://localhost:3000/uploads/image/123/2024/07/newImage.png',
        fileType: 'image',
        ext: '.png',
        width: 800,
        height: 600,
        isPublic: true
      });

      expect(fileService.uploadFileInServer).toHaveBeenCalledWith(newFile, 'image', expect.any(String));
    });
  });