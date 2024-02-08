import { UpdateUser } from "./update-user";

import { ConfirmPasswordNotMatch } from "./errors/confirm-password-not-match";
import { EqualOldPassword } from "./errors/equal-old-password";
import { UserExists } from "./errors/user-exists";
import { UserNotFound } from "./errors/user-not-found";
import { WrongCredentials } from "./errors/wrong-credentials";

import { FakeHasher } from "@/test/cryptography/fake-hasher";
import { makeUser } from "@/test/factories/user-factory";
import { InMemoryUsersRepository } from "@/test/repositories/in-memory-users.repository";

let inMemoryUsersRepository: InMemoryUsersRepository,
  updateUser: UpdateUser,
  fakeHasher: FakeHasher;

describe('Update user', () => {
  beforeEach(() => {
    fakeHasher = new FakeHasher();
    inMemoryUsersRepository = new InMemoryUsersRepository();

    updateUser = new UpdateUser(inMemoryUsersRepository, fakeHasher, fakeHasher);
  });

  it("should be able to update a user", async () => {
    const user = makeUser({
      password: await fakeHasher.hash("123456789")
    });

    await inMemoryUsersRepository.create(user);

    await new Promise(resolve => setTimeout(resolve, 1000));

    const result = await updateUser.execute({
      id: user.id.toString(),
      email: "john.doe@email.com",
      username: "john@doe",
      oldPassword: "123456789",
      newPassword: "12345678",
      confirmPassword: "12345678"
    });

    expect(result.isRight()).toBeTruthy();
    expect(result.value).toEqual({
      user: inMemoryUsersRepository.users[0]
    });
    expect(inMemoryUsersRepository.users[0].updatedAt).toEqual(expect.any(Date));
    expect(inMemoryUsersRepository.users[0].updatedAt).not.toEqual(inMemoryUsersRepository.users[0].createdAt);
  });

  it("should not be able to update a non existing user", async () => {
    const user = makeUser();

    await inMemoryUsersRepository.create(user);

    const result = await updateUser.execute({
      id: "fake-id"
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(UserNotFound);
  });

  it("should not be able to update a user with existing e-mail", async () => {
    const user = makeUser();

    await inMemoryUsersRepository.create(user);
    await inMemoryUsersRepository.create(makeUser({
      email: "email@email.com"
    }));

    const result = await updateUser.execute({
      id: user.id.toString(),
      email: "email@email.com"
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(UserExists);
  });

  it("should not be able to update a user with existing username", async () => {
    const user = makeUser();

    await inMemoryUsersRepository.create(user);
    await inMemoryUsersRepository.create(makeUser({
      username: "username"
    }));

    const result = await updateUser.execute({
      id: user.id.toString(),
      username: "username"
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(UserExists);
  });

  it("should not be able to update a user with current password incorrect", async () => {
    const user = makeUser({
      password: await fakeHasher.hash("12345678")
    });

    await inMemoryUsersRepository.create(user);

    const result = await updateUser.execute({
      id: user.id.toString(),
      oldPassword: "123"
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(WrongCredentials);
  });

  it("should not be able to update a user with the new password being the same as the current password", async () => {
    const user = makeUser({
      password: await fakeHasher.hash("12345678")
    });

    await inMemoryUsersRepository.create(user);

    const result = await updateUser.execute({
      id: user.id.toString(),
      oldPassword: "12345678",
      newPassword: "12345678",
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(EqualOldPassword);
  });

  it("should not be able to update a user without matching new password and confirm password", async () => {
    const user = makeUser({
      password: await fakeHasher.hash("12345678")
    });

    await inMemoryUsersRepository.create(user);

    const result = await updateUser.execute({
      id: user.id.toString(),
      oldPassword: "12345678",
      newPassword: "1234567",
      confirmPassword: "123456"
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(ConfirmPasswordNotMatch);
  });
});