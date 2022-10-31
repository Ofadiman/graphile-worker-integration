import { ConfigurableModuleBuilder, Global, Inject, Module } from '@nestjs/common'
import { makeWorkerUtils, WorkerUtils } from 'graphile-worker'
import { WorkerUtilsOptions } from 'graphile-worker/dist/interfaces'
import { Job } from './job'

const ConfigurableSchedulerModule = new ConfigurableModuleBuilder<WorkerUtilsOptions>().build()

const WORKER_UTILS_TOKEN = Symbol('WORKER_UTILS_TOKEN')
export const InjectWorkerUtils = () => Inject(WORKER_UTILS_TOKEN)

export class SchedulerService {
  constructor(@InjectWorkerUtils() readonly workerUtils: WorkerUtils) {}

  async schedule<JobClass extends Job>(job: JobClass): Promise<void> {
    await this.workerUtils.addJob(job.config.name, job.config.payload, job.config.taskSpec)
  }
}

@Module({
  providers: [
    SchedulerService,
    {
      provide: WORKER_UTILS_TOKEN,
      inject: [ConfigurableSchedulerModule.MODULE_OPTIONS_TOKEN],
      useFactory: async (options: WorkerUtils) => {
        return await makeWorkerUtils(options)
      },
    },
  ],
  exports: [WORKER_UTILS_TOKEN, SchedulerService],
})
@Global()
export class SchedulerModule extends ConfigurableSchedulerModule.ConfigurableModuleClass {}
