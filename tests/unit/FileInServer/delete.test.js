const path = require('path');
const boom = require('@hapi/boom');
const fs = require('fs');
jest.mock('fs');
const SaveFileInServer = require('../../../services/saveFileInServer.service');

describe('deleteFile', () => {
  let fileService;
  beforeEach(() => {
    fileService = new SaveFileInServer();
  });
  test('should delete file correctly', async () => {
    fs.unlinkSync.mockImplementation((path, callback) => callback(null));

    await expect(
      fileService.deleteFile('path/to/file')
    ).resolves.toBeUndefined();
  });

  test('should throw error if delete fails', async () => {
    fs.unlinkSync.mockImplementation((path, callback) =>
      callback(new Error('Delete failed'))
    );

    await expect(fileService.deleteFile('path/to/file')).rejects.toThrow(
      'Delete failed'
    );
  });
});
