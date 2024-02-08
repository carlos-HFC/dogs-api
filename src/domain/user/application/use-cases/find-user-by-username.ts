import { Injectable } from "@nestjs/common";

import { UserNotFound } from "./errors/user-not-found";

import { User } from "../entities/user";
import { UserRepository } from "../repositories/user.repository";

import { Either, left, right } from "@/core/either";

interface FindUserByUsernameRequest {
  username: string;
}

type FindUserByUsernameResponse = Either<
  UserNotFound,
  {
    user: User;
  }
>;

@Injectable()
export class FindUserByUsername {
  constructor(
    private userRepository: UserRepository
  ) {}

  async execute(request: FindUserByUsernameRequest): Promise<FindUserByUsernameResponse> {
    const user = await this.userRepository.findByUsername(request.username);

    if (!user) {
      return left(new UserNotFound());
    }

    return right({ user });
  }
}