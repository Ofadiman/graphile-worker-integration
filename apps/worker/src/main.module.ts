import { Module } from '@nestjs/common'

import { HealthController } from './health/health.controller'
import { HandleRandomJob } from './jobs/random.job'
import { WorkerModule } from '@graphile-worker-integration/graphile-worker'

@Module({
  imports: [
    WorkerModule.register({
      connectionString: 'postgresql://postgres:password@database:5432/postgres',
    }),
  ],
  controllers: [HealthController],
  providers: [HandleRandomJob],
})
export class MainModule {}
