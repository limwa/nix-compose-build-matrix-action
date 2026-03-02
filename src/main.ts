import * as core from '@actions/core'
import { wait } from './wait.js'
import { Effect, pipe } from 'effect'

/**
 * The main function for the action.
 *
 * @returns Resolves when the action is complete.
 */
export const run = pipe(
  Effect.gen(function* () {
    const ms = core.getInput('milliseconds')

    // Debug logs are only output if the `ACTIONS_STEP_DEBUG` secret is true
    core.debug(`Waiting ${ms} milliseconds ...`)

    // Log the current timestamp, wait, then log the new timestamp
    core.debug(new Date().toTimeString())
    yield* wait(parseInt(ms, 10))
    core.debug(new Date().toTimeString())

    // Set outputs for other workflow steps to use
    core.setOutput('time', new Date().toTimeString())
  }),
  Effect.tapErrorTag('ValidationError', (error) =>
    Effect.sync(() => {
      // Fail the workflow run if an error occurs
      if (error instanceof Error) core.setFailed(error.message)
    })
  )
)
