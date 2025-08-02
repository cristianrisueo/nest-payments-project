import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DomainExceptionFilter } from './shared/filters/exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Registers global exception filter
  app.useGlobalFilters(new DomainExceptionFilter());

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
