import { Module } from '@nestjs/common'
import { ConsoleModule } from 'nestjs-console'
import { DatabaseCli } from './cli/database.cli'
import { KnexModule } from '@graphile-worker-integration/knex'
import { SchedulerModule } from '@graphile-worker-integration/graphile-worker'

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
        port: 5432,
      },
    }),
    SchedulerModule.register({
      connectionString: 'postgresql://postgres:password@database:5432/postgres',
    }),
  ],
  providers: [DatabaseCli],
  exports: [DatabaseCli],
})
export class CliModule {}
