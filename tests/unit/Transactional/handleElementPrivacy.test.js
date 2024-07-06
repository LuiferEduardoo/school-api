const { superAdmin } = require('../../../middlewares/auth.handler');
const Transactional = require('../../../services/Transactional.service');

jest.mock('../../../middlewares/auth.handler', () => ({
    superAdmin: ['administrador', 'coordinador', 'rector']
}));

describe('handleElementPrivacy', () => {
    let transactionalService;

    beforeEach(() => {
        transactionalService = new Transactional();
        checkPermissionToPrivacySpy = jest.spyOn(transactionalService, 'checkPermissionToPrivacy');
    });

    afterEach(() => {
        checkPermissionToPrivacySpy.mockRestore();
    });

    test('should set field to value if user has superAdmin role and value is defined', () => {
        checkPermissionToPrivacySpy.mockReturnValue(true);
        const req = { user: { role: 'administrador' } };
        const where = {};
        const field = 'isPrivate';
        const value = true;
        transactionalService.handleElementPrivacy(req, where, field, value);
        expect(where).toEqual({ isPrivate: true });
    });

    test('should not set field if user does not have superAdmin role', () => {
        checkPermissionToPrivacySpy.mockReturnValue(false);
        const req = { user: { role: 'user' } };
        const where = {};
        const field = 'isPrivate';
        const value = true;
        transactionalService.handleElementPrivacy(req, where, field, value);
        expect(where).toEqual({});
    });

    test('should not set field if value is undefined', () => {
        checkPermissionToPrivacySpy.mockReturnValue(true);
        const req = { user: { role: 'administrador' } };
        const where = {};
        const field = 'isPrivate';
        const value = undefined;
        transactionalService.handleElementPrivacy(req, where, field, value);
        expect(where).toEqual({});
    });

    test('should not set field if value is null', () => {
        checkPermissionToPrivacySpy.mockReturnValue(true);
        const req = { user: { role: 'administrador' } };
        const where = {};
        const field = 'isPrivate';
        const value = null;
        transactionalService.handleElementPrivacy(req, where, field, value);
        expect(where).toEqual({});
    });

    test('should not set field if value is an empty string', () => {
        checkPermissionToPrivacySpy.mockReturnValue(true);
        const req = { user: { role: 'administrador' } };
        const where = {};
        const field = 'isPrivate';
        const value = '';
        transactionalService.handleElementPrivacy(req, where, field, value);
        expect(where).toEqual({});
    });
});