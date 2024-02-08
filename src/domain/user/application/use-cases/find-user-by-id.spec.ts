import { FindUserById } from "./find-user-by-id";

import { UserNotFound } from "./errors/user-not-found";

import { makeUser } from "@/test/factories/user-factory";
import { InMemoryUsersRepository } from "@/test/repositories/in-memory-users.repository";

let inMemoryUsersRepository: InMemoryUsersRepository,
  findUserById: FindUserById;

describe("Find user by id", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();

    findUserById = new FindUserById(inMemoryUsersRepository);
  });

  it("should be able to find a user by id", async () => {
    const user = makeUser();

    await inMemoryUsersRepository.create(user);

    const result = await findUserById.execute({
      id: user.id.toString()
    });

    expect(result.isRight()).toBeTruthy();
    expect(result.value).toEqual({
      user: inMemoryUsersRepository.users[0]
    });
  });

  it("should not be able to find a non existing user", async () => {
    const user = makeUser();

    const result = await findUserById.execute({
      id: user.id.toString()
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(UserNotFound);
  });
});