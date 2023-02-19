export class UserRegistrationError extends Error {

    public static readonly ERROR_USER_ALREADY_REGISTERED = 'user_already_registered'
    public static readonly ERROR_PASSWORD_HASH_REQUIRED = 'password_hash_required'

    constructor(public type: string, message: string) {
        super(message)
    }
}