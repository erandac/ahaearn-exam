import { ValidationError } from 'joi'
import { toErrorResponse, ErrorCode } from '../contracts'
import { Request, Response, NextFunction } from 'express'
import logger from '@earnaha/core/logger'
import { UserRegistrationError } from '@earnaha/services'

export function handleInputValidationError() {
    const middleware = (err: any, req: Request, res: Response, next: NextFunction) => {
        if (err instanceof ValidationError) {
            const message = err.details[0].message
            res.status(400).send(toErrorResponse(message, ErrorCode.ValidationError))
            logger.debug(message)
        } else if (err instanceof UserRegistrationError) {
            const errorCode = err.type == UserRegistrationError.ERROR_USER_ALREADY_REGISTERED ? ErrorCode.ItemAlredyExists : ErrorCode.ValidationError
            res.status(400).send(toErrorResponse(err.message, errorCode))
            logger.debug(err.message)
        }
        else {
            next(err)
        }
    }
    return middleware
}
