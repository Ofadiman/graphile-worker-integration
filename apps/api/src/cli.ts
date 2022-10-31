import duration from 'dayjs/plugin/duration'
import dayjs from 'dayjs'

dayjs.extend(duration)

import { BootstrapConsole } from 'nestjs-console'
import { CliModule } from './cli.module'

const bootstrap = new BootstrapConsole({
  module: CliModule,
  contextOptions: {
    bufferLogs: true,
    autoFlushLogs: true,
  },
  useDecorators: true,
})

bootstrap.init().then(async (app) => {
  try {
    await app.init()
    await bootstrap.boot()
    await app.close()
  } catch (e) {
    console.error(e)
    await app.close()
    process.exit(1)
  }
})
