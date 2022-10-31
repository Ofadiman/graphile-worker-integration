import { HandleJob, Job, JobHandler } from '@graphile-worker-integration/graphile-worker'
import dayjs from 'dayjs'
import { JobHelpers } from 'graphile-worker'
import { waitFor } from '../utils/wait-for'

export type QueuedJobPayload = {
  message: string
}

export class QueuedJob extends Job<QueuedJobPayload> {}

@HandleJob(QueuedJob)
export class HandleQueuedJob implements JobHandler<QueuedJob> {
  async handle(payload: QueuedJobPayload, helpers: JobHelpers): Promise<void> {
    const waitDuration = dayjs.duration({ seconds: 10 })
    console.log(
      `Waiting for ${waitDuration.asSeconds()} seconds in queue ${helpers.job.queue_name}.`,
    )
    await waitFor(waitDuration.asMilliseconds())
    console.log(
      `Handling job in queue: ${helpers.job.queue_name}, the message is: ${payload.message}`,
    )
  }
}
