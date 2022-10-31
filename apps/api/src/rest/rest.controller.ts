import { Body, Controller, Post } from '@nestjs/common'
import { SchedulerService } from '@graphile-worker-integration/graphile-worker'
import { RandomJob, NotifyJob } from '@graphile-worker-integration/worker'
import { IsISO8601, IsString } from 'class-validator'

class NotifyRequestBodyDto {
  @IsString()
  message: string

  @IsString()
  jobKey: string

  @IsISO8601()
  runAt: string
}

@Controller('jobs')
export class RestController {
  constructor(private readonly schedulerService: SchedulerService) {}

  @Post('random')
  async createRandomJob() {
    await this.schedulerService.schedule(
      new RandomJob({ name: RandomJob.name, payload: { randomNumber: Math.random() } }),
    )
  }

  @Post('notify')
  async notify(@Body() body: NotifyRequestBodyDto) {
    await this.schedulerService.schedule(
      new NotifyJob({
        name: NotifyJob.name,
        payload: { message: body.message },
        taskSpec: {
          jobKey: body.jobKey,
          runAt: new Date(body.runAt),
        },
      }),
    )
  }
}
