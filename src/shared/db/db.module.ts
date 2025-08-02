import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { DbConnection } from './db.config';

@Module({
  imports: [
    // Users database connection
    MongooseModule.forRootAsync({
      connectionName: 'users',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        // Retrieves the users database configuration from the config file
        const config = configService.get<DbConnection>('db.users');

        // Validates that the configuration is defined
        if (!config) {
          throw new Error('Users database configuration not found');
        }

        // Returns the Mongoose connection options
        return {
          uri: config.uri,
          ...config.options,
        };
      },
    }),

    // Payments database connection
    MongooseModule.forRootAsync({
      connectionName: 'payments',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        // Retrieves the payments database configuration from the config file
        const config = configService.get<DbConnection>('db.payments');

        // Validates that the configuration is defined
        if (!config) {
          throw new Error('Payments database configuration not found');
        }

        // Returns the Mongoose connection options
        return {
          uri: config.uri,
          ...config.options,
        };
      },
    }),
  ],
})
export class DbModule {}
