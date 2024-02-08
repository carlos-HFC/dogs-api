import { Injectable } from "@nestjs/common";

import { UserNotFound } from "./errors/user-not-found";

import { User } from "../entities/user";
import { UserRepository } from "../repositories/user.repository";

import { Either, left, right } from "@/core/either";

interface FindUserByEmailRequest {
  email: string;
}

type FindUserByEmailResponse = Either<
  UserNotFound,
  {
    user: User;
  }
>;

@Injectable()
export class FindUserByEmail {
  constructor(
    private userRepository: UserRepository
  ) {}

  async execute(request: FindUserByEmailRequest): Promise<FindUserByEmailResponse> {
    const user = await this.userRepository.findByEmail(request.email);

    if (!user) {
      return left(new UserNotFound());
    }

    return right({ user });
  }
}