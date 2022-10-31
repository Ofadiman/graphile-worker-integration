import { HandleJob, Job, JobHandler } from '@graphile-worker-integration/graphile-worker'

export type CronJobPayload = { message: string }

export class CronJob extends Job<CronJobPayload> {}

@HandleJob(CronJob)
export class HandleCronJob implements JobHandler<CronJob> {
  async handle(payload: CronJobPayload): Promise<void> {
    console.log(`Handling cron job. Payload message: ${payload.message}`)
  }
}
