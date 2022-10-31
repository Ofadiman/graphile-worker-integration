import { HandleJob, Job, JobHandler } from '@graphile-worker-integration/graphile-worker'
import dayjs from 'dayjs'
import { waitFor } from '../utils/wait-for'

export type RandomJobPayload = {
  number: number
}

export class RandomJob extends Job<RandomJobPayload> {}

let currentIteration = 1

@HandleJob(RandomJob)
export class HandleRandomJob implements JobHandler<RandomJob> {
  async handle(payload: RandomJobPayload): Promise<void> {
    const waitDuration = dayjs.duration({ seconds: 10 })
    console.log(`Waiting for ${waitDuration.asSeconds()} seconds at iteration ${currentIteration}.`)
    currentIteration++
    await waitFor(waitDuration.asMilliseconds())
    console.log(`Handling random job with number: ${payload.number}.`)
  }
}
