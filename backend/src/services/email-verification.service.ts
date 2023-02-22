import { User, EmailVerification } from '@earnaha/persistence/models'
import { UserRegistration, AuthProviderTypes, EmailStatusTypes, EmailVerificationTypes } from './data'
import { EmailVerificationError } from './exceptions'
import { Repository } from 'sequelize-typescript';
import crypto from 'crypto'
import { dbContext } from '@earnaha/persistence'


export class EmailVerificationService {


    public static Factory() {
        const repo = dbContext.getRepository(EmailVerification)
        return new EmailVerificationService(repo)
    }

    constructor(private emailVerificationRepository: Repository<EmailVerification>) {

    }

    public async sendEmailAddressVerification(verificationId: number, email: string, firstName: string): Promise<boolean> {
        // TODO implement sendgrid email sending 
        return Promise.resolve(true)
    }

    public async sendForgotpasswordVerification(userId: number, email: string, firstName: string): Promise<string> {
        const verificationId = crypto.randomBytes(32).toString('hex')
        var vefification = await this.emailVerificationRepository.create({
            verificationId,
            kind: EmailVerificationTypes.ForgotPassword,
            userLoginId: userId
        })
        // TODO  Send email
        return verificationId
    }

    public async getuserIdByVerificationId(verificationId: string): Promise<number> {
        const details = await this.emailVerificationRepository.findByPk(verificationId)
        if (details == null) {
            throw new EmailVerificationError(EmailVerificationError.ERROR_VERIFICATION_NOT_FOUND, 'Email verification not found')
        }
        return details.userLoginId
    }

    public async removeByVerificationId(verificationId: string): Promise<boolean> {
        const numDeleted = await this.emailVerificationRepository.destroy({ where: { verificationId: verificationId } })
        return numDeleted == 1
    }

}