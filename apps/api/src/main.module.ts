import { Module, ValidationPipe } from '@nestjs/common'

import { HealthController } from './health/health.controller'
import { SchedulerModule } from '@graphile-worker-integration/graphile-worker'
import { RestController } from './rest/rest.controller'
import { APP_PIPE } from '@nestjs/core'

@Module({
  imports: [
    SchedulerModule.register({
      connectionString: 'postgresql://postgres:password@database:5432/postgres',
    }),
  ],
  controllers: [HealthController, RestController],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        forbidUnknownValues: true,
        forbidNonWhitelisted: true,
      }),
    },
  ],
})
export class MainModule {}
