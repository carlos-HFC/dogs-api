import { Injectable } from "@nestjs/common";

import { ConfirmPasswordNotMatch } from "./errors/confirm-password-not-match";
import { EqualOldPassword } from "./errors/equal-old-password";
import { UserExists } from "./errors/user-exists";
import { UserNotFound } from "./errors/user-not-found";
import { WrongCredentials } from "./errors/wrong-credentials";

import { HashComparer } from "../cryptography/hash-comparer";
import { HashGenerator } from "../cryptography/hash-generator";
import { User } from "../entities/user";
import { UserRepository } from "../repositories/user.repository";

import { Either, left, right } from "@/core/either";

interface UpdateUserRequest {
  id: string;
  username?: string;
  email?: string;
  oldPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

type UpdateUserResponse = Either<
  ConfirmPasswordNotMatch |
  EqualOldPassword |
  UserExists |
  UserNotFound |
  WrongCredentials,
  {
    user: User;
  }
>;

@Injectable()
export class UpdateUser {
  constructor(
    private userRepository: UserRepository,
    private hashComparer: HashComparer,
    private hashGenerator: HashGenerator
  ) {}

  async execute(request: UpdateUserRequest): Promise<UpdateUserResponse> {
    const user = await this.userRepository.findById(request.id);

    if (!user) {
      return left(new UserNotFound());
    }

    const [userWithSameEmail, userWithSameUsername] = await Promise.all([
      request.email && this.userRepository.findByEmail(request.email),
      request.username && this.userRepository.findByUsername(request.username),
    ]);

    if (userWithSameEmail || userWithSameUsername) {
      return left(new UserExists());
    }

    if (request.oldPassword) {
      const isPasswordValid = await this.hashComparer.compare(request.oldPassword, user.password);

      if (!isPasswordValid) {
        return left(new WrongCredentials());
      }

      const isSamePassword = request.oldPassword === request.newPassword;

      if (isSamePassword) {
        return left(new EqualOldPassword());
      }

      const confirmPasswordIsDifferent = request.newPassword !== request.confirmPassword;

      if (confirmPasswordIsDifferent) {
        return left(new ConfirmPasswordNotMatch());
      }
    }

    Object.assign(user, {
      ...user,
      email: request.email ?? user.email,
      username: request.username ?? user.username,
      password: request.newPassword
        ? await this.hashGenerator.hash(request.newPassword)
        : user.password
    });

    user.update();

    await this.userRepository.save(user);

    return right({ user });
  }
}