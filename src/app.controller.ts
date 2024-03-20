import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AppService, ICreateUserParams } from './app.service';

export class GetUsersParamsDTO {
  id?: string;
  name?: string;
  email?: string;
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

@Controller('users')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  async createUser(@Body() params: ICreateUserParams): Promise<IUser> {
    return this.appService.createUser(params);
  }

  @Get()
  async getUsers(@Query() params: GetUsersParamsDTO): Promise<IUser[]> {
    return this.appService.getUsers(params);
  }
}
