import { ErrorResponseTypeDef, QueryResponseTypeDef } from 'src/types/types'

class ResponseBody {
  data: unknown
  error: ErrorResponseTypeDef | null
  constructor(data: unknown, error: ErrorResponseTypeDef | null) {
    this.data = data ?? null
    this.error = error
  }
}
export class ErrorBody {
  constructor(
    public message: string,
    public cause: unknown,
    public statusCode?: number | undefined
  ) {
    this.message = message ?? 'Unknown error occurred'
    this.cause = cause ?? ''
    this.statusCode = statusCode ?? 400
  }
}

export class ResponseManager {
  handleResponse(res: QueryResponseTypeDef) {
    const responseBody = new ResponseBody(res, null)
    return responseBody
  }

  handleError(error: unknown, message?: string, statusCode?: number) {
    if (error instanceof ErrorBody) return error
    else {
      const newError: Error = new Error(message, {
        cause: (error as Error)?.message || error
      })
      const errorBody = new ErrorBody(newError.message, newError.cause, statusCode)
      return errorBody
    }
  }

  generateErrorDto(err: ErrorResponseTypeDef) {
    const response = new ResponseBody(null, err)
    const buffer = Buffer.from(JSON.stringify(response))
    return buffer
  }
}
