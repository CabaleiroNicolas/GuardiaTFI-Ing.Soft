import { Body, Controller, Get, HttpCode, HttpStatus, Inject, Post, Query } from '@nestjs/common';
import { IUserService } from '../application/ports/user-service.interface';
import { CreateUserRequestVO } from '../domain/value-objects/create-user.vo';

@Controller('users')
export class UserController {

  constructor(
    @Inject('USER_SERVICE')
    private readonly userService: IUserService
) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async registerUser(@Body() request: CreateUserRequestVO) {
    await this.userService.createUser(request.email, request.password);
    return { message: 'User registered succesfully' };
  }

  @Get('confirm')
  async confirmUserEmail(@Query('token') token: string) {
    await this.userService.confirmUser(token);
  }

}