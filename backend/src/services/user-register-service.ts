import { Repository } from 'sequelize-typescript';
import { User, EmailVerification } from '@earnaha/persistence/models'
import { UserRegistration, AuthProviderTypes, EmailStatusTypes } from './data'
import { UserRegistrationError } from './exceptions'
import { EmailVerificationService } from './email-verification.service'
import { dbContext } from '@earnaha/persistence'

export class UserRegisterService {


    public static Factory(): UserRegisterService {
        const userRepo = dbContext.getRepository(User)
        const emailVerification = EmailVerificationService.Factory()
        return new UserRegisterService(userRepo, emailVerification)
    }

    constructor(private userLoginRepository: Repository<User>, private emailVerification: EmailVerificationService) {

    }

    public async registerNewUser(data: UserRegistration): Promise<number> {

        if (data.authProvider == AuthProviderTypes.Internal && !data.passwordHash) {
            throw new UserRegistrationError(UserRegistrationError.ERROR_PASSWORD_HASH_REQUIRED, `Password hash rquired for internal registration`)
        }

        const user = await this.userLoginRepository.findOne({ where: { email: data.email } })

        if (user !== null) {
            throw new UserRegistrationError(UserRegistrationError.ERROR_USER_ALREADY_REGISTERED, `User already registered with email ${data.email}`)
        }

        let model = data.toModelData()


        var newUser = await this.userLoginRepository.create(model)

        if (newUser.requireEmailVerification()) {
            this.emailVerification.sendEmailAddressVerification(newUser.id, newUser.email, newUser.firstName)
        }

        return newUser.id
    }


    public async startPasswordRecovery(email: string) {

        if (!email) {
            throw new UserRegistrationError(UserRegistrationError.ERROR_EMAIL_REQUIRED, `Email address required`)
        }

        const user = await this.userLoginRepository.findOne({ where: { email: email } })

        if (user === null) {
            throw new UserRegistrationError(UserRegistrationError.ERROR_EMAIL_NOT_AVIALBLE, `email address not avaiable`)
        }

        await this.emailVerification.sendForgotpasswordVerification(user.id, email, user.firstName)
    }

    public async changePasswordByRecovery(verificationId: string, newPasswordHash: string) {
        const userId = await this.emailVerification.getuserIdByVerificationId(verificationId)

        const user = await this.userLoginRepository.findByPk(userId)

        if (user === null) {
            throw new UserRegistrationError(UserRegistrationError.ERROR_USER_NOT_AVAILABLE, `User not available for the verification`)
        }
        user.set({
            passwordHash: newPasswordHash
        })
        await user.save()

        await this.emailVerification.removeByVerificationId(verificationId)
    }


}
