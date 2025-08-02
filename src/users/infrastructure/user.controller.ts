import {
  Controller,
  Post,
  Get,
  Delete,
  Patch,
  Body,
  Param,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import {
  RegisterUserUseCase,
  RegisterUserRequest,
  RegisterUserResponse,
} from '../application/registerUser';
import {
  AuthenticateUserUseCase,
  AuthenticateUserRequest,
  AuthenticateUserResponse,
} from '../application/authenticateUser';
import {
  GetUserByIdUseCase,
  GetUserByIdResponse,
} from '../application/getUserById';
import {
  GetUserByEmailUseCase,
  GetUserByEmailResponse,
} from '../application/getUserByEmail';
import {
  DeleteUserUseCase,
  DeleteUserResponse,
} from '../application/deleteUser';
import {
  ChangePasswordUseCase,
  ChangePasswordRequest,
  ChangePasswordResponse,
} from '../application/changePassword';

/**
 * User Controller
 * Handles HTTP requests for user-related operations.
 * Acts as the entry point for the users domain from the outside world.
 */
@Controller('users')
export class UserController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly authenticateUserUseCase: AuthenticateUserUseCase,
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
    private readonly getUserByEmailUseCase: GetUserByEmailUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
    private readonly changePasswordUseCase: ChangePasswordUseCase,
  ) {}

  /**
   * Register a new user.
   * POST /users/register
   */
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() request: RegisterUserRequest,
  ): Promise<RegisterUserResponse> {
    return await this.registerUserUseCase.execute(request);
  }

  /**
   * Authenticate a user with email and password.
   * POST /users/authenticate
   */
  @Post('authenticate')
  @HttpCode(HttpStatus.OK)
  async authenticate(
    @Body() request: AuthenticateUserRequest,
  ): Promise<AuthenticateUserResponse> {
    return await this.authenticateUserUseCase.execute(request);
  }

  /**
   * Get user by ID.
   * GET /users/:id
   */
  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<GetUserByIdResponse> {
    return await this.getUserByIdUseCase.execute({ id });
  }

  /**
   * Get user by email (via query parameter).
   * GET /users/email/:email
   */
  @Get('email/:email')
  async getUserByEmail(
    @Param('email') email: string,
  ): Promise<GetUserByEmailResponse> {
    return await this.getUserByEmailUseCase.execute({ email });
  }

  /**
   * Change user password.
   * PATCH /users/:id/password
   */
  @Patch(':id/password')
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @Param('id') id: string,
    @Body() request: Omit<ChangePasswordRequest, 'id'>,
  ): Promise<ChangePasswordResponse> {
    return await this.changePasswordUseCase.execute({ id, ...request });
  }

  /**
   * Delete user by ID.
   * DELETE /users/:id
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteUser(@Param('id') id: string): Promise<DeleteUserResponse> {
    return await this.deleteUserUseCase.execute({ id });
  }
}
