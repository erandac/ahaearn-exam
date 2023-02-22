import * as express from 'express'
import joi from 'joi'
import { AuthProviderTypes, SecretValidationService, UserRegisterService, UserRegistration } from '@earnaha/services'
import asyncHandler from 'express-async-handler'


const userRegistrationschema = joi.object(
    {
        firstName: joi.string().required().trim(),
        lastName: joi.string().required().trim(),
        email: joi.string().required().email().trim().lowercase(),
        termAndPolicy: joi.boolean().valid(true).required(),
        password: joi.string().required().custom((value, helper) => {
            const passwordValidation = new SecretValidationService()
            try {
                passwordValidation.validate(value)
                return value.trim()
            } catch (error: any) {
                return helper.message(error.message)
            }
        })
    })


export const registerInternal = asyncHandler(async (req: express.Request, res: express.Response) => {
    const result = await userRegistrationschema.validateAsync(req.body)
    const passwordValidation = new SecretValidationService()
    const passwardHash = await passwordValidation.applyHash(result.password)

    const registration = new UserRegistration(
        result.firstName,
        result.lastName,
        result.email,
        AuthProviderTypes.Internal,
        passwardHash
    )
    const registrationService = UserRegisterService.Factory()
    const userId = await registrationService.registerNewUser(registration)
    res.send({ id: userId })
})


