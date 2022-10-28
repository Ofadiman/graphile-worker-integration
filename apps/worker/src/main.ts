import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

const PORT = process.env.PORT || 3334

async function bootstrap() {
  const nestApplication = await NestFactory.create(AppModule)
  await nestApplication.listen(PORT)
}

bootstrap().then(() => {
  Logger.log(`🚀 Application is running on: http://localhost:${PORT}`)
})
