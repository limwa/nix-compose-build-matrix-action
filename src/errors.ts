import { Data } from 'effect'

export class ValidationError extends Data.TaggedError('ValidationError')<{
  message: string
}> {}
