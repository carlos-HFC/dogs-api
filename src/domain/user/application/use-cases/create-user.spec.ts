import { CreateUser } from "./create-user";

import { UserExists } from "./errors/user-exists";

import { FakeHasher } from "@/test/cryptography/fake-hasher";
import { makeUser } from "@/test/factories/user-factory";
import { InMemoryUsersRepository } from "@/test/repositories/in-memory-users.repository";

let inMemoryUsersRepository: InMemoryUsersRepository,
  createUser: CreateUser,
  fakeHasher: FakeHasher;

describe("Create user", () => {
  beforeEach(() => {
    fakeHasher = new FakeHasher();
    inMemoryUsersRepository = new InMemoryUsersRepository();

    createUser = new CreateUser(inMemoryUsersRepository, fakeHasher);
  });

  it("should be able to create user", async () => {
    const result = await createUser.execute(makeUser());

    expect(result.isRight()).toBeTruthy();
    expect(result.value).toEqual({
      user: inMemoryUsersRepository.users[0]
    });
    expect(inMemoryUsersRepository.users).toHaveLength(1);
  });

  it("should hash user password upon registration", async () => {
    const result = await createUser.execute(makeUser());

    const hashPassword = await fakeHasher.hash(makeUser().password);

    expect(result.isRight()).toBeTruthy();
    expect(result.value).toEqual({
      user: inMemoryUsersRepository.users[0]
    });
    expect(inMemoryUsersRepository.users).toHaveLength(1);
    expect(inMemoryUsersRepository.users[0].password).toEqual(hashPassword);
  });

  it("should not be able to create user with existing e-mail", async () => {
    await createUser.execute(makeUser());

    const result = await createUser.execute(makeUser({
      username: "username"
    }));

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(UserExists);
  });

  it("should not be able to create user with existing username", async () => {
    await createUser.execute(makeUser());

    const result = await createUser.execute(makeUser({
      email: "email@email.com"
    }));

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(UserExists);
  });
});