import { Module } from '@nestjs/common'

import { HealthController } from './health/health.controller'
import { SchedulerModule } from '@graphile-worker-integration/graphile-worker'
import { RestController } from './rest/rest.controller'

@Module({
  imports: [
    SchedulerModule.register({
      connectionString: 'postgresql://postgres:password@database:5432/postgres',
    }),
  ],
  controllers: [HealthController, RestController],
})
export class MainModule {}