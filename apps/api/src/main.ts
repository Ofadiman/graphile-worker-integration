import duration from 'dayjs/plugin/duration'
import dayjs from 'dayjs'

dayjs.extend(duration)

import { Logger } from '@nestjs/common'
import { MainModule } from './main.module'
import { NestFactory } from '@nestjs/core'

const PORT = process.env.PORT || 3333

async function bootstrap() {
  const nestApplication = await NestFactory.create(MainModule)
  await nestApplication.listen(PORT)
}

bootstrap().then(() => {
  Logger.log(`🚀 Application is running on: http://localhost:${PORT}`)
})
