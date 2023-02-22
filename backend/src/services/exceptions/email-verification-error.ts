export class EmailVerificationError extends Error {

    public static readonly ERROR_VERIFICATION_NOT_FOUND = 'email_verification_not_found'

    constructor(public type: string, message: string) {
        super(message)
    }
}