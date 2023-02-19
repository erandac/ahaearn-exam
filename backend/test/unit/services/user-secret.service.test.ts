import { SecretValidationError, SecretValidationService } from '@earnaha/services'

let service: SecretValidationService;

const knownHash = "$2b$10$1huQUamW43S7X5TAIIPveuQPSD9dxibJaDQT6//Opgk4Kxe124GC6"
const knownPassword = "Eidfdsa@d72d"

describe("password validation", () => {
    beforeAll(() => {
        service = new SecretValidationService();
    })

    it('should thorw SecretValidationError when input is null', () => {
        expect(() => {
            service.validate(null!)
        }).toThrowError(SecretValidationError)
    })

    it('should thorw SecretValidationError when input is undefined', () => {
        expect(() => {
            service.validate(undefined!)
        }).toThrowError(SecretValidationError)
    })

    it('should thorw SecretValidationError when input is empty', () => {
        expect(() => {
            service.validate("")
        }).toThrowError(SecretValidationError)
    })

    it('should thorw SecretValidationError when input length less than 8', () => {
        expect(() => {
            service.validate("Ei4&fNe")
        }).toThrowError(SecretValidationError)
    })

    it('should thorw SecretValidationError when input not have uppercase char', () => {
        expect(() => {
            service.validate("ei4&fne!")
        }).toThrowError(SecretValidationError)
    })

    it('should thorw SecretValidationError when input not have lowercase char', () => {
        expect(() => {
            service.validate("EI4&FNE!")
        }).toThrowError(SecretValidationError)
    })

    it('should thorw SecretValidationError when input not have digits char', () => {
        expect(() => {
            service.validate("EiX&fNe!")
        }).toThrowError(SecretValidationError)
    })

    it('should thorw SecretValidationError when input not have symbols char', () => {
        expect(() => {
            service.validate("Ei4XfNeX")
        }).toThrowError(SecretValidationError)
    })

    it('should NOT thorw SecretValidationError when input matches all the password rules', () => {
        expect(() => {
            service.validate("Ei4&fNe!Y7")
        }).not.toThrowError(SecretValidationError)
    })
})


describe('apply password hash', () => {

    beforeAll(() => {
        service = new SecretValidationService();
    })

    it('should thorw SecretValidationError if input is falsy', async () => {
        await expect(async () => {
            await service.applyHash(null!)
        }).rejects.toThrowError(SecretValidationError)

        await expect(async () => {
            await service.applyHash(undefined!)
        }).rejects.toThrowError(SecretValidationError)

        await expect(async () => {
            await service.applyHash("")
        }).rejects.toThrowError(SecretValidationError)
    })

    it('should return a value for input text', async () => {
        const hash = await service.applyHash('Eidfdsa@d72d')
        expect(hash).toBeDefined()
    })
})


describe('compare password and hash', () => {

    beforeAll(() => {
        service = new SecretValidationService();
    })

    it('should throw SecretValidationError if password input is falsy', async () => {
        await expect(async () => {
            await service.comparePasswordAndHash(null!, knownHash)
        }).rejects.toThrowError(SecretValidationError)

        await expect(async () => {
            await service.comparePasswordAndHash(undefined!, knownHash)
        }).rejects.toThrowError(SecretValidationError)

        await expect(async () => {
            await service.comparePasswordAndHash("", knownHash)
        }).rejects.toThrowError(SecretValidationError)

    })

    it('should throw SecretValidationError if hashed input is falsy', async () => {
        await expect(async () => {
            await service.comparePasswordAndHash(knownPassword, null!)
        }).rejects.toThrowError(SecretValidationError)

        await expect(async () => {
            await service.comparePasswordAndHash(knownPassword, undefined!)
        }).rejects.toThrowError(SecretValidationError)

        await expect(async () => {
            await service.comparePasswordAndHash(knownPassword, "")
        }).rejects.toThrowError(SecretValidationError)
    })

    it('should return false for incorrect password and known hash pair', async () => {
        const result = await service.comparePasswordAndHash('Eidfdsa@d72d!!', knownHash)
        expect(result).toBe(false)
    })

    it('should return false for incorrect hash and known password pair', async () => {
        const result = await service.comparePasswordAndHash(knownPassword, "notnownHash")
        expect(result).toBe(false)
    })

    it('should return true for known hash and password pair', async () => {
        const result = await service.comparePasswordAndHash(knownPassword, knownHash)
        expect(result).toBe(true)
    })

})

describe('apply password hash and compare', () => {

    beforeAll(() => {
        service = new SecretValidationService();
    })

    it('should return true when comparing for given password and its hash', async () => {
        const myPass = '7Hkdi$ds!Id3Y'
        const hash = await service.applyHash(myPass)
        const result = await service.comparePasswordAndHash(myPass, hash)
        expect(result).toBe(true)
    })

})