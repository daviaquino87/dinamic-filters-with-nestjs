import { Injectable } from '@nestjs/common';
import { GetUsersParamsDTO, IUser } from './app.controller';
import { PrismaService } from './prisma.service';
import { applyFilters } from './utils/filters';
import { Prisma } from '@prisma/client';
import { randomUUID } from 'crypto';

export interface ICreateUserParams {
  name: string;
  email: string;
}

@Injectable()
export class AppService {
  constructor(private readonly prismaService: PrismaService) {}

  async createUser(params: ICreateUserParams) {
    return this.prismaService.user.create({
      data: {
        id: randomUUID(),
        name: params.name,
        email: params.email,
      },
    });
  }

  async getUsers(params: GetUsersParamsDTO): Promise<IUser[]> {
    const { whereBuilder } = await applyFilters<Prisma.UserWhereInput>({
      appliedFiltersInput: params,
      availableFilters: {
        id: async ({ filter }) => {
          return {
            where: {
              id: {
                equals: String(filter),
              },
            },
          };
        },
        name: async ({ filter }) => {
          return {
            where: {
              name: {
                contains: String(filter),
                mode: 'insensitive',
              },
            },
          };
        },
        email: async ({ filter }) => {
          return {
            where: {
              email: {
                equals: String(filter),
              },
            },
          };
        },
      },
    });

    return this.prismaService.user.findMany({
      where: whereBuilder,
    });
  }
}
