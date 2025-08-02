import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DbModule } from './shared/db/db.module';
import { dbConfig } from './shared/db/db.config';
import { UsersModule } from './users/infrastructure/user.module';

@Module({
  imports: [
    // Global configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: [dbConfig],
      envFilePath: '.env',
    }),

    // Database connections
    DbModule,

    // Domain modules
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
