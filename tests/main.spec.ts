/**
 * Unit tests for the action's main functionality, src/main.js
 *
 * To mock dependencies in ESM, you can create fixtures that export mock
 * functions and objects. For example, the core module is mocked in this test,
 * so that the actual '@actions/core' module is not imported.
 */
import { vi, beforeEach, afterEach, it, describe, expect } from 'vitest'
import * as core from '@actions/core'
import { wait } from '../src/wait.js'
import { run } from '../src/main.js'
import { Effect } from 'effect'
import { ValidationError } from '../src/errors.js'

vi.mock(import('@actions/core'), { spy: true })
vi.mock(import('../src/wait.js'), { spy: true })

describe('main.js', () => {
  beforeEach(() => {
    // Set the action's inputs as return values from core.getInput().
    vi.mocked(core.getInput).mockImplementation(() => '500')

    // Mock the wait function so that it does not actually wait.
    vi.mocked(wait).mockImplementation(() => Effect.succeed('done!'))
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  it('Sets the time output', async () => {
    await Effect.runPromise(run)

    // Verify the time output was set.
    expect(core.setOutput).toHaveBeenNthCalledWith(
      1,
      'time',
      // Simple regex to match a time string in the format HH:MM:SS.
      expect.stringMatching(/^\d{2}:\d{2}:\d{2}/)
    )
  })

  it('Sets a failed status', async () => {
    // Clear the getInput mock and return an invalid value.
    vi.mocked(core.getInput)
      .mockClear()
      .mockReturnValueOnce('this is not a number')

    // Clear the wait mock and return a rejected promise.
    vi.mocked(wait)
      .mockClear()
      .mockReturnValue(
        Effect.fail(
          new ValidationError({ message: 'milliseconds is not a number' })
        )
      )

    await Effect.runPromiseExit(run)

    // Verify that the action was marked as failed.
    expect(core.setFailed).toHaveBeenNthCalledWith(
      1,
      'milliseconds is not a number'
    )
  })
})
