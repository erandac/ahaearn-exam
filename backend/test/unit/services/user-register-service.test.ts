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
        const service = new UserRegisterService(userRepo, EmailVerificationService.Factory())
        const newRegistration = new UserRegistration("Eranda", "Nandasena", "testuser@test.com", AuthProviderTypes.Internal, "PasswordHash")

        await expect(async () => {
            await service.registerNewUser(newRegistration)
        }).rejects.toThrowError(UserRegistrationError)
    })

    it('should throw UserRegistrationError when AuthProviderTypes.Internal and password hash is empty', async () => {
        const userRepo = dbContext.getRepository(User)
        const service = new UserRegisterService(userRepo, EmailVerificationService.Factory())
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
        const emailTransport = EmailVerificationService.Factory()

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
        const emailTransport = EmailVerificationService.Factory()

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



describe('start password recovery', () => {

    beforeEach(() => {
        jest.clearAllMocks()
    })

    const nullValues = [null, undefined, '']

    nullValues.forEach(value => {
        it(`should throw error if email parameter is ${value}`, async () => {

            const userRepo = dbContext.getRepository(User)
            const emailTransport = EmailVerificationService.Factory()

            // mock findOne to get exising user, set to null for continue rest of the code
            const findOneMock = jest.spyOn(userRepo, 'findOne')
            const dummyUser = Promise.resolve(null);
            findOneMock.mockReturnValue(dummyUser)

            // mock send email to ensure no email is actually sending
            const mockSendEmail = jest.spyOn(emailTransport, 'sendForgotpasswordVerification')
            mockSendEmail.mockReturnValue(Promise.resolve('refid'))

            const service = new UserRegisterService(userRepo, emailTransport)

            await expect(async () => {
                const result = await service.startPasswordRecovery('testuser@test.com')
            }).rejects.toThrowError(UserRegistrationError)

        })
    })

    it(`should throw error if user can't find`, async () => {

        const userRepo = dbContext.getRepository(User)
        const emailTransport = EmailVerificationService.Factory()

        // mock findOne to get exising user, set to null for continue rest of the code
        const findOneMock = jest.spyOn(userRepo, 'findOne')
        const dummyUser = Promise.resolve(null);
        findOneMock.mockReturnValue(dummyUser)

        // mock send email to ensure no email is actually sending
        const mockSendEmail = jest.spyOn(emailTransport, 'sendForgotpasswordVerification')
        mockSendEmail.mockReturnValue(Promise.resolve('refid'))

        const service = new UserRegisterService(userRepo, emailTransport)

        await expect(async () => {
            const result = await service.startPasswordRecovery('testuser@test.com')
        }).rejects.toThrowError(UserRegistrationError)

    })

    it(`should throw error if user email validation is pending`, async () => {

        const userRepo = dbContext.getRepository(User)
        const emailTransport = EmailVerificationService.Factory()

        // mock findOne to get exising user, set to null for continue rest of the code
        const findOneMock = jest.spyOn(userRepo, 'findOne')
        const dummyUser = Promise.resolve(new User({ 'emailStatus': EmailStatusTypes.Pennding }));
        findOneMock.mockReturnValue(dummyUser)

        // mock send email to ensure no email is actually sending
        const mockSendEmail = jest.spyOn(emailTransport, 'sendForgotpasswordVerification')
        mockSendEmail.mockReturnValue(Promise.resolve('refid'))

        const service = new UserRegisterService(userRepo, emailTransport)

        await expect(async () => {
            const result = await service.startPasswordRecovery('testuser@test.com')
        }).rejects.toThrowError(UserRegistrationError)

    })

    it(`should sendForgotpasswordVerification should call for email validated user`, async () => {

        const userRepo = dbContext.getRepository(User)
        const emailTransport = EmailVerificationService.Factory()

        const findOneMock = jest.spyOn(userRepo, 'findOne')
        const dummyUser = Promise.resolve(new User({ 'emailStatus': EmailStatusTypes.Validated, id: 123, firstName: 'test' }));
        findOneMock.mockReturnValue(dummyUser)

        // mock send email to ensure no email is actually sending
        const mockSendEmail = jest.spyOn(emailTransport, 'sendForgotpasswordVerification')
        mockSendEmail.mockReturnValue(Promise.resolve('refid'))

        const service = new UserRegisterService(userRepo, emailTransport)

        const result = await service.startPasswordRecovery('testuser@test.com')

        expect(mockSendEmail.mock.calls.length).toBe(1)

    })
})


describe('accept password change by recovery', () => {

    const nullValues = [null, undefined, '']

    nullValues.forEach((value) => {

        it(`should throw error if verificationId parameter is '${value}'`, async () => {

            const userRepo = dbContext.getRepository(User)
            const emailTransport = EmailVerificationService.Factory()

            // mock findOne to get exising user, set to null for continue rest of the code
            const findOneMock = jest.spyOn(userRepo, 'findByPk')

            const user = new User()
            const userSave = jest.spyOn(user, 'save')

            const dummyUser = Promise.resolve(user);
            findOneMock.mockReturnValue(dummyUser)

            // mock send email to ensure no email is actually sending
            const mockSendEmail = jest.spyOn(emailTransport, 'getuserIdByVerificationId')
            mockSendEmail.mockReturnValue(Promise.resolve(1))

            const mockRemoveEmailVarification = jest.spyOn(emailTransport, 'removeByVerificationId')
            mockRemoveEmailVarification.mockReturnValue(Promise.resolve(true))

            const service = new UserRegisterService(userRepo, emailTransport)

            await expect(async () => {
                const result = await service.acceptPasswordChangeByRecovery(value!, 'pwhash')
            }).rejects.toThrowError(UserRegistrationError)

        })

        it(`should throw error if passwordHash parameter is '${value}'`, async () => {

            const userRepo = dbContext.getRepository(User)
            const emailTransport = EmailVerificationService.Factory()

            // mock findOne to get exising user, set to null for continue rest of the code
            const findOneMock = jest.spyOn(userRepo, 'findByPk')

            const user = new User()
            const userSave = jest.spyOn(user, 'save')

            const dummyUser = Promise.resolve(user);
            findOneMock.mockReturnValue(dummyUser)

            // mock send email to ensure no email is actually sending
            const mockSendEmail = jest.spyOn(emailTransport, 'getuserIdByVerificationId')
            mockSendEmail.mockReturnValue(Promise.resolve(1))

            const mockRemoveEmailVarification = jest.spyOn(emailTransport, 'removeByVerificationId')
            mockRemoveEmailVarification.mockReturnValue(Promise.resolve(true))

            const service = new UserRegisterService(userRepo, emailTransport)

            await expect(async () => {
                const result = await service.acceptPasswordChangeByRecovery('refid', value!)
            }).rejects.toThrowError(UserRegistrationError)

        })
    })

    it(`should throw error if user can't find`, async () => {

        const userRepo = dbContext.getRepository(User)
        const emailTransport = EmailVerificationService.Factory()

        // mock findOne to get exising user, set to null for continue rest of the code
        const findOneMock = jest.spyOn(userRepo, 'findByPk')

        const dummyUser = Promise.resolve(null);
        findOneMock.mockReturnValue(dummyUser)

        // mock send email to ensure no email is actually sending
        const mockSendEmail = jest.spyOn(emailTransport, 'getuserIdByVerificationId')
        mockSendEmail.mockReturnValue(Promise.resolve(1))

        const mockRemoveEmailVarification = jest.spyOn(emailTransport, 'removeByVerificationId')
        mockRemoveEmailVarification.mockReturnValue(Promise.resolve(true))

        const service = new UserRegisterService(userRepo, emailTransport)

        await expect(async () => {
            const result = await service.acceptPasswordChangeByRecovery('refid', 'paseordhash')
        }).rejects.toThrowError(UserRegistrationError)

    })

    it(`should call user save and remove verification if user can be found`, async () => {

        const userRepo = dbContext.getRepository(User)
        const emailTransport = EmailVerificationService.Factory()

        // mock findOne to get exising user, set to null for continue rest of the code
        const findOneMock = jest.spyOn(userRepo, 'findByPk')

        const user = new User()
        const userSave = jest.spyOn(user, 'save')

        const dummyUser = Promise.resolve(user);
        findOneMock.mockReturnValue(dummyUser)

        // mock send email to ensure no email is actually sending
        const mockSendEmail = jest.spyOn(emailTransport, 'getuserIdByVerificationId')
        mockSendEmail.mockReturnValue(Promise.resolve(1))

        const mockRemoveEmailVarification = jest.spyOn(emailTransport, 'removeByVerificationId')
        mockRemoveEmailVarification.mockReturnValue(Promise.resolve(true))

        const service = new UserRegisterService(userRepo, emailTransport)

        await service.acceptPasswordChangeByRecovery('refid', 'paseordhash')

        expect(userSave.mock.calls.length).toBe(1)
        expect(mockRemoveEmailVarification.mock.calls.length).toBe(1)
    })

})