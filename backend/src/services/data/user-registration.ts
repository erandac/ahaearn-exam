import { AuthProviderTypes, EmailStatusTypes } from './enum-types'

export class UserRegistration {
    constructor(
        public firstName: string,
        public lastName: string,
        public email: string,
        public authProvider: AuthProviderTypes,
        public passwordHash?: string,
        public authSubject?: string) {
    }

    public toModelData() {
        var model = {
            firstName: this.firstName.trim(),
            lastName: this.lastName.trim(),
            email: this.email.toLowerCase(),
            // email ldo not need to validate for the public auth provider
            emailStatus: this.authProvider != AuthProviderTypes.Internal ? EmailStatusTypes.Validated : EmailStatusTypes.Pennding,
            passwordHash: this.passwordHash,
            authProvider: this.authProvider
        }
        return model
    }

}
