import { Injectable } from "@nestjs/common";

import { UserNotFound } from "./errors/user-not-found";

import { User } from "../entities/user";
import { UserRepository } from "../repositories/user.repository";

import { Either, left, right } from "@/core/either";

interface FindUserByIdRequest {
  id: string;
}

type FindUserByIdResponse = Either<
  UserNotFound,
  {
    user: User;
  }
>;

@Injectable()
export class FindUserById {
  constructor(
    private userRepository: UserRepository
  ) {}

  async execute(request: FindUserByIdRequest): Promise<FindUserByIdResponse> {
    const user = await this.userRepository.findById(request.id);

    if (!user) {
      return left(new UserNotFound());
    }

    return right({ user });
  }
}