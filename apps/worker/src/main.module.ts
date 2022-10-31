import { Module } from '@nestjs/common'

import { HealthController } from './health/health.controller'
import { HandleRandomJob } from './jobs/random.job'
import { WorkerModule } from '@graphile-worker-integration/graphile-worker'
import { HandleNotifyJob } from './jobs/notify.job'
import { HandleQueuedJob } from './jobs/queued.job'
import dayjs from 'dayjs'
import { CronJob, HandleCronJob } from './jobs/cron.job'

const everyHour = Array.from({ length: 24 }).map((_, index) => index)
const everyMinute = Array.from({ length: 60 }).map((_, index) => index)
const everyMonth = Array.from({ length: 12 }).map((_, index) => index + 1)
const everyDay = Array.from({ length: 31 }).map((_, index) => index + 1)
const everyDayOfWeek = Array.from({ length: 7 }).map((_, index) => index)

@Module({
  imports: [
    WorkerModule.register({
      connectionString: 'postgresql://postgres:password@database:5432/postgres',
      concurrency: 10,
      maxPoolSize: 10,
      noHandleSignals: false,
      pollInterval: dayjs.duration({ seconds: 1 }).asMilliseconds(),
      parsedCronItems: [
        {
          task: CronJob.name,
          options: {
            backfillPeriod: dayjs.duration({ minutes: 1 }).asMilliseconds(),
          },
          hours: everyHour,
          minutes: everyMinute,
          months: everyMonth,
          dates: everyDay,
          dows: everyDayOfWeek,
          identifier: '1285e328-8cda-42ad-bd58-9c4a69fc5530',
          payload: {
            message: 'Hello world',
          },
        },
      ],
    }),
  ],
  controllers: [HealthController],
  providers: [HandleRandomJob, HandleNotifyJob, HandleQueuedJob, HandleCronJob],
})
export class MainModule {}
