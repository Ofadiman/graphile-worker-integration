import { Module } from '@nestjs/common'

import { HealthController } from './health/health.controller'
import { HandleRandomJob } from './jobs/random.job'
import { WorkerModule } from '@graphile-worker-integration/graphile-worker'
import { HandleNotifyJob } from './jobs/notify.job'
import { HandleQueuedJob } from './jobs/queued.job'
import dayjs from 'dayjs'

@Module({
  imports: [
    WorkerModule.register({
      connectionString: 'postgresql://postgres:password@database:5432/postgres',
      concurrency: 10,
      maxPoolSize: 10,
      noHandleSignals: false,
      pollInterval: dayjs.duration({ seconds: 1 }).asMilliseconds(),
    }),
  ],
  controllers: [HealthController],
  providers: [HandleRandomJob, HandleNotifyJob, HandleQueuedJob],
})
export class MainModule {}
