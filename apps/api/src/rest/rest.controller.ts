import { Controller, Post } from '@nestjs/common'
import { SchedulerService } from '@graphile-worker-integration/graphile-worker'
import { RandomJob } from '../../../worker/src/jobs/random.job'

@Controller('jobs')
export class RestController {
  constructor(private readonly schedulerService: SchedulerService) {}

  @Post('random')
  async createRandomJob() {
    await this.schedulerService.schedule(new RandomJob({ randomNumber: Math.random() }))
  }
}
