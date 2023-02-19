export class EmailVerificationService {

    public async sendEmailAddressVerification(userId: number, email: string, firstName: string): Promise<boolean> {
        // TODO implement sendgrid email sending 
        return Promise.resolve(true)
    }

}