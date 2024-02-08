import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { User, UserProps } from "@/domain/user/application/entities/user";

export function makeUser(override: Partial<UserProps> = {}, id?: UniqueEntityId) {
  return User.create({
    email: "johndoe@email.com",
    username: "john.doe",
    password: "123456789",
    ...override
  }, id);
}