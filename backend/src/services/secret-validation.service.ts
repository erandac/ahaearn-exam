import PasswordValidator from 'password-validator'
import bcrypt from 'bcrypt'

import { SecretValidationError } from './exceptions/secret-validation-error'


export class SecretValidationService {

    private static saltRounds = 10;

    private static schema = new PasswordValidator()
        .is().min(8)            // contains at least 8 characters
        .is().max(60)
        .has().uppercase(1)     // contains at least one upper character
        .has().lowercase(1)     // contains at least one lower character
        .has().digits(1)        // contains at least one digit character
        .has().symbols(1)       // contains at least one special character


    public validate(password: string): void {
        if (!password) {
            throw new SecretValidationError("Password Can't be null")
        }

        if (!SecretValidationService.schema.validate(password)) {

            throw new SecretValidationError("Password validation faliled")
        }
    }

    public async applyHash(password: string): Promise<string> {

        if (!password) {
            throw new SecretValidationError("Password Can't be null")
        }

        const hash = await bcrypt.hash(password.trim(), SecretValidationService.saltRounds)
        return hash;
    }

    public async comparePasswordAndHash(password: string, hash: string): Promise<boolean> {

        if (!password) {
            throw new SecretValidationError("Password Can't be null")
        }

        if (!hash) {
            throw new SecretValidationError("hash value must avaialble")
        }

        return await bcrypt.compare(password, hash)

    }


}