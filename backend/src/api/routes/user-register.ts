import * as express from 'express'
import joi from 'joi'
import { AuthProviderTypes, SecretValidationService, UserRegisterService, UserRegistration } from '@earnaha/services'
import asyncHandler from 'express-async-handler'


const userRegistrationSchema = joi.object(
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

const passwordRecoverySchema = joi.object(
    {
        email: joi.string().required().email().trim().lowercase()
    })


export const registerInternal = asyncHandler(async (req: express.Request, res: express.Response) => {

    const result = await userRegistrationSchema.validateAsync(req.body)
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


export const startPasswordRecovery = asyncHandler(async (req: express.Request, res: express.Response) => {
    const result = await passwordRecoverySchema.validateAsync(req.body)
    const registrationService = UserRegisterService.Factory()
    await registrationService.startPasswordRecovery(result.email)
    res.send()
})

