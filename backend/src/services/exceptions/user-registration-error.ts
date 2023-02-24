export class UserRegistrationError extends Error {

    public static readonly ERROR_USER_ALREADY_REGISTERED = 'user_already_registered'
    public static readonly ERROR_USER_NOT_AVAILABLE = 'user_not_available'
    public static readonly ERROR_PASSWORD_HASH_REQUIRED = 'password_hash_required'
    public static readonly ERROR_EMAIL_REQUIRED = 'email_required'
    public static readonly ERROR_EMAIL_VALIDATION_REQUIRED = 'email_validation_required'
    public static readonly ERROR_EMAIL_NOT_AVIALBLE = 'email_not_available'
    public static readonly ERROR_VERIFICATION_ID_REQUIRED = 'verification_id_required'

    constructor(public type: string, message: string) {
        super(message)
    }
}