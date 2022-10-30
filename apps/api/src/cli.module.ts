import { Module } from '@nestjs/common'
import { ConsoleModule } from 'nestjs-console'
import { DatabaseCli } from './cli/database.cli'
import { KnexModule } from '@graphile-worker-integration/knex'

@Module({
  imports: [
    ConsoleModule,
    KnexModule.register({
      client: 'pg',
      connection: {
        database: 'postgres',
        user: 'postgres',
        password: 'password',
        host: 'database',
        port: 5432
      },
    }),
  ],
  providers: [DatabaseCli],
  exports: [DatabaseCli],
})
export class CliModule {}
