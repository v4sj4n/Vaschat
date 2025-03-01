import { Injectable } from '@nestjs/common';

// This should be a real class/interface representing a user entity
export type User = {
  userId: number;
  username: string;
  password: string;
};

@Injectable()
export class UsersService {
  constructor() {}

  async findOne(username: string): Promise<User | undefined> {
    return undefined;
  }
}
