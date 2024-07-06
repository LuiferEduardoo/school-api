const { superAdmin } = require('../../../middlewares/auth.handler');
const Transactional = require('../../../services/Transactional.service');

jest.mock('../../../middlewares/auth.handler', () => ({
    superAdmin: ['administrador', 'coordinador', 'rector']
}));

describe('checkPermissionToPrivacy', ()  => {
    let transactionalService;

    beforeEach(() => {
        transactionalService = new Transactional();
    });

    describe('', () => {
        test('should return true if user role is administrador', () => {
            const req = { user: { role: 'administrador' } };
            const result = transactionalService.checkPermissionToPrivacy(req);
            expect(result).toBe(true);
        });

        test('shoudshould return true if user role is administrador', () => {
            const req = { user: { role: 'coordinador' } };
            const result = transactionalService.checkPermissionToPrivacy(req);
            expect(result).toBe(true);
        });

        test('shoudshould return true if user role is rector', () => {
            const req = { user: { role: 'rector' } };
            const result = transactionalService.checkPermissionToPrivacy(req);
            expect(result).toBe(true);
        });
    })


    test('should return false if user role is not superAdmin', () => {
        const req = { user: { role: 'estudiante' } };
        const result = transactionalService.checkPermissionToPrivacy(req);
        expect(result).toBe(false);
    });

    test('should return false if user is undefined', () => {
        const req = {};
        const result = transactionalService.checkPermissionToPrivacy(req);
        expect(result).toBe(false);
    });
})