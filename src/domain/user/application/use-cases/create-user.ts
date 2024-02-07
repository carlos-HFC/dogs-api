import { Injectable } from "@nestjs/common";

import { UserExists } from "./errors/user-exists";

import { HashGenerator } from "../cryptography/hash-generator";
import { User } from "../entities/user";
import { UserRepository } from "../repositories/user.repository";

import { Either, left, right } from "@/core/either";

interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
}

type CreateUserResponse = Either<
  UserExists,
  {
    user: User;
  }
>;

@Injectable()
export class CreateUser {
  constructor(
    private userRepository: UserRepository,
    private hashGenerator: HashGenerator
  ) {}

  async execute(request: CreateUserRequest): Promise<CreateUserResponse> {
    const { email, username, password } = request;

    const [userWithSameEmail, userWithSameUsername] = await Promise.all([
      this.userRepository.findByEmail(email),
      this.userRepository.findByUsername(username),
    ]);

    if (userWithSameEmail || userWithSameUsername) {
      return left(new UserExists());
    }

    const hashPassword = await this.hashGenerator.hash(password);

    const user = User.create({
      email,
      username,
      password: hashPassword
    });

    await this.userRepository.create(user);

    return right({ user });
  }
}