import { Module } from '@nestjs/common'
import { ConsoleModule } from 'nestjs-console'
import { DatabaseCli } from './cli/database.cli'

@Module({
  imports: [ConsoleModule],
  providers: [DatabaseCli],
  exports: [DatabaseCli],
})
export class CliModule {}
