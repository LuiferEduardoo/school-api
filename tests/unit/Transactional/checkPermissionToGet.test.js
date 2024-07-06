const { superAdmin } = require('../../../middlewares/auth.handler');
const Transactional = require('../../../services/Transactional.service');

jest.mock('../../../middlewares/auth.handler', () => ({
    superAdmin: ['administrador', 'coordinador', 'rector']
}));

describe('checkPermissionToGet', ()  => {
    let transactionalService;

    beforeEach(() => {
        transactionalService = new Transactional();
        checkPermissionToPrivacySpy = jest.spyOn(transactionalService, 'checkPermissionToPrivacy');
    });

    afterEach(() => {
        checkPermissionToPrivacySpy.mockRestore();
    });


    test('should return an empty object if user has superAdmin role', () => {
        checkPermissionToPrivacySpy.mockReturnValue(true);
        const req = { user: { role: 'administrador' } };
        const result = transactionalService.checkPermissionToGet(req);
        expect(result).toEqual({});
        expect(checkPermissionToPrivacySpy).toHaveBeenCalledWith(req);
    });

    test('should return an object with property set to true if user does not have superAdmin role', () => {
        checkPermissionToPrivacySpy.mockReturnValue(false);
        const req = { user: { role: 'user' } };
        const result = transactionalService.checkPermissionToGet(req);
        expect(result).toEqual({ visible: true });
        expect(checkPermissionToPrivacySpy).toHaveBeenCalledWith(req);
    });

    test('should use custom property if provided', () => {
        checkPermissionToPrivacySpy.mockReturnValue(false);
        const req = { user: { role: 'user' } };
        const result = transactionalService.checkPermissionToGet(req, 'customProperty');
        expect(result).toEqual({ customProperty: true });
        expect(checkPermissionToPrivacySpy).toHaveBeenCalledWith(req);
    });
})