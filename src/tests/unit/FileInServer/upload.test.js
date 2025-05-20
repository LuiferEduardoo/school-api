const path = require('path');
const boom = require('@hapi/boom');
const fs = require('fs');
jest.mock('fs');
const SaveFileInServer = require('../../../services/saveFileInServer.service');
const getFormattedDate = require('../../integration/helpers/getFormattedDate.js');

describe('upload file', () => {
  let FileService;
  let mockRequest;

  beforeEach(() => {
    FileService = new SaveFileInServer();
    mockRequest = {
      fields: {
        folder: 'testFolder',
        fileType: 'image',
        imageCredits: 'credit1,credit2',
        isPublic: 'true,false',
      },
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
    };
  });

  describe('handleUploadFileInServer', () => {
    describe('upload files', () => {
      test('should handle image upload correctly', async () => {
        // Mocking internal methods
        FileService.uploadFileInServer = jest.fn().mockResolvedValue({
          uniqueFilePath: {
            fileName: 'testImage.webp',
            ext: '.webp',
          },
          width: 800,
          height: 600,
          fileType: 'image',
        });

        FileService.baseUrl = jest
          .fn()
          .mockReturnValue('http://localhost:3000');

        const result = await FileService.handleUploadFileInServer(
          mockRequest
        );

        expect(result).toEqual([
          {
            name: 'testImage.webp',
            ext: '.webp',
            width: 800,
            height: 600,
            folder: `/uploads_test/image/testFolder/123/${getFormattedDate()}`, // Ajusta esta ruta según la fecha actual
            url: `http://localhost:3000/uploads_test/image/testFolder/123/${getFormattedDate()}/testImage.webp`,
            userId: '123',
            fileTypeFile: 'image',
            fileType: 'image',
            imageCredits: 'credit1',
            isPublic: true,
          },
        ]);
      });

      test('should handle file upload correctly', async () => {
        // Mocking internal methods
        FileService.uploadFileInServer = jest.fn().mockResolvedValue({
          uniqueFilePath: {
            fileName: 'testFile.pdf',
            ext: '.pdf',
          },
          fileType: 'application/pdf',
        });

        FileService.baseUrl = jest
          .fn()
          .mockReturnValue('http://localhost:3000');

        mockRequest.files.files = [
          {
            name: 'testFile.pdf',
            type: 'application/pdf',
            size: 12345,
          },
        ];
        mockRequest.fields = {
          folder: 'testFolder',
          fileType: 'document',
          imageCredits: '',
          isPublic: 'true',
        };

        const result = await FileService.handleUploadFileInServer(
          mockRequest
        );
        
        expect(result).toEqual([
          {
            name: 'testFile.pdf',
            ext: '.pdf',
            width: undefined,
            height: undefined,
            folder: `/uploads_test/document/testFolder/123/${getFormattedDate()}`, // Ajusta esta ruta según la fecha actual
            url: `http://localhost:3000/uploads_test/document/testFolder/123/${getFormattedDate()}/testFile.pdf`,
            userId: '123',
            fileTypeFile: 'document',
            fileType: 'application/pdf',
            imageCredits: undefined,
            isPublic: true,
          },
        ]);
      });
    });

    test('should throw error if no file provided', async () => {
      mockRequest.files.files = [{}];

      await expect(
        FileService.handleUploadFileInServer(mockRequest)
      ).rejects.toThrow(
        'No se proporcionó ningún archivo o el nombre del archivo es inválido'
      );
    });
  });
});