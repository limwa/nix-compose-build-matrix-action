/**
 * The entrypoint for the action. This file simply imports and runs the action's
 * main logic.
 */
import { Effect } from 'effect'
import { run } from './main.js'

/* istanbul ignore next */
await Effect.runPromise(run)
