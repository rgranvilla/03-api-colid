import { Prisma, User } from '@prisma/client';
import { UsersRepository } from '../users-repository';
import { randomUUID } from 'crypto';

export class InMemoryUsersRepository implements UsersRepository {
  private items: User[] = [];

  async findById(userId: string): Promise<User | null> {
    return this.items.find((user) => user.id === userId) || null;
  }

  async findByEmail(email: string) {
    return this.items.find((user) => user.email === email) || null;
  }

  async create(data: Prisma.UserCreateInput) {
    const user: User = {
      id: randomUUID(),
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      created_at: new Date(),
    };

    this.items.push(user);

    return user;
  }
}
