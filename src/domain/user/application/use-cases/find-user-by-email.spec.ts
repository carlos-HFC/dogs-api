import { FindUserByEmail } from "./find-user-by-email";

import { UserNotFound } from "./errors/user-not-found";

import { makeUser } from "@/test/factories/user-factory";
import { InMemoryUsersRepository } from "@/test/repositories/in-memory-users.repository";

let inMemoryUsersRepository: InMemoryUsersRepository,
  findUserByEmail: FindUserByEmail;

describe("Find user by e-mail", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();

    findUserByEmail = new FindUserByEmail(inMemoryUsersRepository);
  });

  it("should be able to find a user by e-mail", async () => {
    const user = makeUser();

    await inMemoryUsersRepository.create(user);

    const result = await findUserByEmail.execute({
      email: user.email
    });

    expect(result.isRight()).toBeTruthy();
    expect(result.value).toEqual({
      user: inMemoryUsersRepository.users[0]
    });
  });

  it("should not be able to find a non existing user", async () => {
    const user = makeUser();

    const result = await findUserByEmail.execute({
      email: user.email
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(UserNotFound);
  });
});