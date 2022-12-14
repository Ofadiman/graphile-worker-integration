import {
  ConfigurableModuleBuilder,
  Global,
  Inject,
  Module,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common'
import knex, { Knex } from 'knex'

const ConfigurableKnexModule = new ConfigurableModuleBuilder<Knex.Config>().build()

export const KNEX_TOKEN = Symbol('KNEX_TOKEN')
export const InjectKnex = () => Inject(KNEX_TOKEN)

@Module({
  providers: [
    {
      provide: KNEX_TOKEN,
      inject: [ConfigurableKnexModule.MODULE_OPTIONS_TOKEN],
      useFactory: (config: Knex.Config) => {
        return knex(config)
      },
    },
  ],
  exports: [KNEX_TOKEN],
})
@Global()
export class KnexModule
  extends ConfigurableKnexModule.ConfigurableModuleClass
  implements OnModuleInit, OnModuleDestroy
{
  constructor(@InjectKnex() private readonly knex: Knex) {
    super()
  }

  async onModuleInit(): Promise<void> {
    await this.knex.initialize()
  }

  async onModuleDestroy(): Promise<void> {
    await this.knex.destroy()
  }
}
