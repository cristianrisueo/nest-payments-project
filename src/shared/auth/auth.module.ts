import { Module } from '@nestjs/common';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtService } from './jwt.service';
import { JwtConfig } from './jwt.config';

/**
 * Auth Module.
 * Configures JWT authentication infrastructure.
 * Provides JWT service for token generation and validation.
 */
@Module({
  imports: [
    // Configure NestJS JWT module with our settings
    NestJwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const jwtConfig = configService.get<JwtConfig>('jwt');

        if (!jwtConfig) {
          throw new Error('JWT configuration not found');
        }

        return {
          secret: jwtConfig.secret,
          signOptions: {
            expiresIn: jwtConfig.expiresIn,
          },
        };
      },
    }),
  ],
  providers: [JwtService],
  exports: [JwtService],
})
export class AuthModule {}
