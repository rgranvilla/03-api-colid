import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-repository';
import { beforeEach, describe, expect, it } from 'vitest';
import { AuthenticateUseCase } from './authenticate';
import { hash } from 'bcryptjs';
import { InvalidCredentialsError } from './errors/invalid-credentials-error';

let usersRepository: InMemoryUsersRepository;
let sut: AuthenticateUseCase;

describe('Authenticate Use Case', () => {
  beforeEach(()=>{
    usersRepository = new InMemoryUsersRepository();
    sut = new AuthenticateUseCase(usersRepository);
  });

  it('should be able to authenticate an user', async() => {
    await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@mail.com',
      password_hash: await hash('123456', 6)
    });

    const {user} = await sut.execute({
      email: 'johndoe@mail.com',
      password: '123456'
    });

    expect(user.name).toBe('John Doe');
  });

  it('should not be able to authenticate with wrong email', async() => {
    expect(async () => {
      await sut.execute({
        email: 'wrong@mail.com',
        password: '123456'
      });
    }).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it('should not be able to authenticate with wrong password', async() => {
    await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@mail.com',
      password_hash: await hash('123456', 6)
    });

    await expect(async () => {
      await sut.execute({
        email: 'johndoe@mail.com',
        password: '1234567'
      });
    }).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});