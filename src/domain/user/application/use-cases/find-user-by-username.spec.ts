import { FindUserByUsername } from "./find-user-by-username";

import { UserNotFound } from "./errors/user-not-found";

import { makeUser } from "@/test/factories/user-factory";
import { InMemoryUsersRepository } from "@/test/repositories/in-memory-users.repository";

let inMemoryUsersRepository: InMemoryUsersRepository,
  findUserByUsername: FindUserByUsername;

describe("Find user by username", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();

    findUserByUsername = new FindUserByUsername(inMemoryUsersRepository);
  });

  it("should be able to find a user by username", async () => {
    const user = makeUser();

    await inMemoryUsersRepository.create(user);

    const result = await findUserByUsername.execute({
      username: user.username
    });

    expect(result.isRight()).toBeTruthy();
    expect(result.value).toEqual({
      user: inMemoryUsersRepository.users[0]
    });
  });

  it("should not be able to find a non existing user", async () => {
    const user = makeUser();

    const result = await findUserByUsername.execute({
      username: user.username
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(UserNotFound);
  });
});