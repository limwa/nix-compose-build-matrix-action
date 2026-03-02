import { Duration, Effect } from 'effect'
import { ValidationError } from './errors.js'

/**
 * Waits for a number of milliseconds.
 *
 * @param  milliseconds The number of milliseconds to wait.
 * @returns Resolves with 'done!' after the wait is over.
 */
export function wait(milliseconds: number) {
  return Effect.gen(function* () {
    if (isNaN(milliseconds))
      yield* new ValidationError({ message: 'milliseconds is not a number' })

    yield* Effect.sleep(Duration.millis(milliseconds))
    return 'done!'
  })
}
