import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from './jwt.service';
import { JwtPayload } from './jwt.service';

/**
 * Extended Request interface to include user information.
 * Adds user data extracted from JWT token to the request object.
 */
export interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
  };
}

/**
 * JWT Guard.
 * Protects routes by validating JWT tokens in Authorization header.
 * Extracts user information and adds it to the request object.
 */
@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  /**
   * Validates JWT token and extracts user information.
   * @param context - The execution context containing request information
   * @returns Promise<boolean> - True if token is valid, throws UnauthorizedException if not
   */
  canActivate(context: ExecutionContext): boolean {
    // Get the request object from the execution context
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    // Extract token from Authorization header
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Access token is required');
    }

    try {
      // Validate token and extract payload
      const payload: JwtPayload = this.jwtService.validateToken(token);

      // Add user information to request object
      request.user = {
        id: payload.sub,
        email: payload.email,
      };

      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token', {
        cause: error,
      });
    }
  }

  /**
   * Helper function that extracts JWT token from Authorization header.
   * Expects format: "Bearer <token>"
   * @param request - The HTTP request object
   * @returns string | undefined - The extracted token or undefined if not found
   */
  private extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      return undefined;
    }

    const [type, token] = authHeader.split(' ') ?? [];

    return type === 'Bearer' ? token : undefined;
  }
}
