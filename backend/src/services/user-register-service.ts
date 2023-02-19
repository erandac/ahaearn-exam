import { Repository } from 'sequelize-typescript';
import { User, EmailVerification } from '@earnaha/persistence/models'
import { UserRegistration, AuthProviderTypes, EmailStatusTypes } from './data'
import { UserRegistrationError } from './exceptions'
import { EmailVerificationService } from './email-verification.service'
import crypto from 'crypto'

export class UserRegisterService {

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

        //const emailVerification = crypto.randomBytes(32).toString('hex')

        var newUser = await this.userLoginRepository.create(model)

        if (newUser.requireEmailVerification()) {
            this.emailVerification.sendEmailAddressVerification(newUser.id, newUser.email, newUser.firstName)
        }

        return newUser.id
    }

    public async verifyEmail(emailVerification: string) {

        if (!emailVerification) {
            throw Error("emailVerification required")
        }

    }
}