import { HandleJob, Job, JobHandler } from '@graphile-worker-integration/graphile-worker'

export type NotifyJobPayload = {
  message: string
}

export class NotifyJob extends Job<NotifyJobPayload> {}

@HandleJob(NotifyJob)
export class HandleNotifyJob implements JobHandler<NotifyJob> {
  async handle(payload: NotifyJobPayload): Promise<void> {
    console.log(`Handling notification: ${payload.message}`)
  }
}
