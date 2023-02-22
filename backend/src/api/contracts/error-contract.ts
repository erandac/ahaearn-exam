export class ErrorContract {
    constructor(public message: string, public code: string) {
    }
}

export class ErrorCollection {
    constructor(public errors: ErrorContract[]) { }
}

export function toErrorResponse(message: string, code: string) {
    return new ErrorCollection([new ErrorContract(message, code)])
}

export enum ErrorCode {
    ValidationError = 'validation_error',
    ItemAlredyExists = 'item_already_exists'
}