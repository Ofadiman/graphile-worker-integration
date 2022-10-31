import { Body, Controller, Post } from '@nestjs/common'
import { SchedulerService } from '@graphile-worker-integration/graphile-worker'
import { RandomJob, NotifyJob, QueuedJob } from '@graphile-worker-integration/worker'
import { IsEnum, IsISO8601, IsNumber, IsString } from 'class-validator'
import dayjs from 'dayjs'

class RandomRequestBodyDto {
  @IsNumber()
  number: number
}

class NotifyRequestBodyDto {
  @IsString()
  message: string

  @IsString()
  jobKey: string

  @IsISO8601()
  runAt: string
}

class QueuedRequestBodyDto {
  @IsString()
  message: string

  @IsEnum(['one', 'two'])
  queue: 'one' | 'two'
}

@Controller('jobs')
export class RestController {
  constructor(private readonly schedulerService: SchedulerService) {}

  @Post('random')
  async createRandomJob(@Body() body: RandomRequestBodyDto) {
    await this.schedulerService.schedule(
      new RandomJob({ name: RandomJob.name, payload: { number: body.number } }),
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
          runAt: dayjs(body.runAt).toDate(),
        },
      }),
    )
  }

  @Post('queued')
  async queued(@Body() body: QueuedRequestBodyDto) {
    await this.schedulerService.schedule(
      new QueuedJob({
        name: QueuedJob.name,
        payload: {
          message: body.message,
        },
        taskSpec: {
          queueName: body.queue,
        },
      }),
    )
  }
}
