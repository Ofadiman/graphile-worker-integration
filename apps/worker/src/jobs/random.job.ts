import { HandleJob, Job, JobHandler } from '@graphile-worker-integration/graphile-worker'

export type RandomJobPayload = {
  randomNumber: number
}

export class RandomJob extends Job<RandomJobPayload> {}

@HandleJob(RandomJob)
export class HandleRandomJob implements JobHandler<RandomJob> {
  async handle(payload: RandomJobPayload): Promise<void> {
    console.log(`Random number is ${payload.randomNumber}.`)
  }
}
