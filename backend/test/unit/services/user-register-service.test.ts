import { UserRegisterService, UserRegistration, UserRegistrationError, AuthProviderTypes, EmailVerificationService, EmailStatusTypes } from '@earnaha/services'

import { dbContext } from '@earnaha/persistence'
import { User } from '@earnaha/persistence/models'


describe('register new user', () => {

    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('should throw UserRegistrationError when user already exists with same email', async () => {
        const userRepo = dbContext.getRepository(User)
        const findOneMock = jest.spyOn(userRepo, 'findOne')
        const dummyUser = Promise.resolve(new User());
        findOneMock.mockReturnValue(dummyUser)
        const service = new UserRegisterService(userRepo, new EmailVerificationService())
        const newRegistration = new UserRegistration("Eranda", "Nandasena", "testuser@test.com", AuthProviderTypes.Internal, "PasswordHash")

        await expect(async () => {
            await service.registerNewUser(newRegistration)
        }).rejects.toThrowError(UserRegistrationError)
    })

    it('should throw UserRegistrationError when AuthProviderTypes.Internal and password hash is empty', async () => {
        const userRepo = dbContext.getRepository(User)
        const service = new UserRegisterService(userRepo, new EmailVerificationService())
        let newRegistration = new UserRegistration("Eranda", "Nandasena", "testuser@test.com", AuthProviderTypes.Internal)

        await expect(async () => {
            await service.registerNewUser(newRegistration)
        }).rejects.toThrowError(UserRegistrationError)

        newRegistration = new UserRegistration("Eranda", "Nandasena", "testuser@test.com", AuthProviderTypes.Internal, undefined)

        await expect(async () => {
            await service.registerNewUser(newRegistration)
        }).rejects.toThrowError(UserRegistrationError)

        newRegistration = new UserRegistration("Eranda", "Nandasena", "testuser@test.com", AuthProviderTypes.Internal, "")

        await expect(async () => {
            await service.registerNewUser(newRegistration)
        }).rejects.toThrowError(UserRegistrationError)
    })

    it('should insert new user login if user not already registred', async () => {

        const userRepo = dbContext.getRepository(User)
        const emailTransport = new EmailVerificationService()

        // mock findOne to get exising user, set to null for continue rest of the code
        const findOneMock = jest.spyOn(userRepo, 'findOne')
        const dummyUser = Promise.resolve(null);
        findOneMock.mockReturnValue(dummyUser)

        // mock create entity to check object is about to insert the DB
        const createMock = jest.spyOn(userRepo, 'create')

        const newUserId = 1234

        createMock.mockImplementation((model) => {
            const dummyNewUser = new User({ ...model, ...{ id: newUserId } })
            return dummyNewUser
        })

        // mock send email to ensure no email is actually sending
        const mockSendEmail = jest.spyOn(emailTransport, 'sendEmailAddressVerification')
        mockSendEmail.mockReturnValue(Promise.resolve(true))

        const service = new UserRegisterService(userRepo, emailTransport)
        const newRegistration = new UserRegistration("Eranda", "Nandasena", "testuser@test.com", AuthProviderTypes.Internal, "PasswordHash")
        const result = await service.registerNewUser(newRegistration)
        expect(createMock.mock.calls.length).toBe(1)
        expect(result).toBe(newUserId)

    })

    it('should send verification email when the user registred with user name and password', async () => {

        const userRepo = dbContext.getRepository(User)
        const emailTransport = new EmailVerificationService()

        // mock findOne to get exising user, set to null for continue rest of the code
        const findOneMock = jest.spyOn(userRepo, 'findOne')
        const dummyUser = Promise.resolve(null);
        findOneMock.mockReturnValue(dummyUser)

        // mock create entity to check object is about to insert the DB
        const createMock = jest.spyOn(userRepo, 'create')

        createMock.mockImplementation((model) => {
            const dummyNewUser = new User({ ...model, ...{ id: 1234 } })
            return dummyNewUser
        })

        // mock send email check email sending have been call
        const mockSendEmail = jest.spyOn(emailTransport, 'sendEmailAddressVerification')
        mockSendEmail.mockReturnValue(Promise.resolve(true))

        const service = new UserRegisterService(userRepo, emailTransport)
        const newRegistration = new UserRegistration("Eranda", "Nandasena", "testuser@test.com", AuthProviderTypes.Internal, "PasswordHash")
        const result = await service.registerNewUser(newRegistration)
        expect(mockSendEmail.mock.calls.length).toBe(1)

    })

})