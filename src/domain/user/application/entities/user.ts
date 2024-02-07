import { Entity } from "@/core/entities/entity";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Optional } from "@/core/types/optional";

export interface UserProps {
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

type CreateUser = Optional<UserProps, "createdAt" | "updatedAt">;

export class User extends Entity<UserProps> {
  public get username() {
    return this.props.username;
  }

  public set username(username: string) {
    this.props.username = username;
  }

  public get email() {
    return this.props.email;
  }

  public set email(email: string) {
    this.props.email = email;
  }

  public get password() {
    return this.props.password;
  }

  public set password(password: string) {
    this.props.password = password;
  }

  public get createdAt() {
    return this.props.createdAt;
  }

  public get updatedAt() {
    return this.props.updatedAt;
  }

  public update() {
    this.props.updatedAt = new Date();
  }

  static create(props: CreateUser, id?: UniqueEntityId) {
    const user = new User({
      ...props,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    }, id);

    return user;
  }
}