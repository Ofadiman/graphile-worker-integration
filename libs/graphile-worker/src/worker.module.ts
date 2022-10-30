import {
  ConfigurableModuleBuilder,
  Global,
  Inject,
  Module,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common'
import { DiscoveryModule, DiscoveryService } from '@nestjs/core'
import { run, Runner } from 'graphile-worker'
import { RunnerOptions, Task } from 'graphile-worker/dist/interfaces'
import { mergeAll } from 'ramda'
import { JOB_KEY } from './job'

export const ConfigurableWorkerModule = new ConfigurableModuleBuilder<RunnerOptions>().build()

@Module({
  imports: [DiscoveryModule],
})
@Global()
export class WorkerModule
  extends ConfigurableWorkerModule.ConfigurableModuleClass
  implements OnModuleInit, OnModuleDestroy
{
  private runner: Runner | null = null

  constructor(
    @Inject(ConfigurableWorkerModule.MODULE_OPTIONS_TOKEN)
    readonly options: RunnerOptions,
    readonly discoveryService: DiscoveryService,
  ) {
    super()
  }

  async onModuleInit(): Promise<void> {
    if (!this.options) {
      return
    }

    const providers = this.discoveryService.getProviders()

    const taskList = providers.reduce<Record<string, Task>>((accumulator, provider) => {
      if (!provider.instance) {
        return accumulator
      }

      const metadata = Reflect.getMetadata(JOB_KEY, provider.instance.constructor)
      if (!metadata) {
        return accumulator
      }

      accumulator[metadata.name] = async (payload, helpers) => {
        await provider.instance.handle(payload, helpers)
      }

      return accumulator
    }, {})

    this.runner = await run(
      mergeAll([
        this.options,
        {
          taskList,
        },
      ]),
    )
  }

  async onModuleDestroy(): Promise<void> {
    if (this.runner) {
      await this.runner.stop()
    }
  }
}
