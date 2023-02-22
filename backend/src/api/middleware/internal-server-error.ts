import { toErrorResponse, ErrorCode } from '../contracts'
import { Request, Response, NextFunction } from 'express'
import logger from '@earnaha/core/logger'

export function hanldeInternalServerError() {
    const middleware = (err: any, req: Request, res: Response, next: NextFunction) => {
        res.status(500).send(toErrorResponse("Internal Server Error", "internal_server_error"))
        logger.error(err.message)
    }
    return middleware
}