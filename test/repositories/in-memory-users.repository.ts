import { User } from "@/domain/user/application/entities/user";
import { UserRepository } from "@/domain/user/application/repositories/user.repository";

export class InMemoryUsersRepository implements UserRepository {
  public users: User[] = [];

  async findById(id: string): Promise<User | null> {
    const user = this.users.find(item => item.id.toString() === id);

    if (!user) return null;

    return user;
  }

  async findByUsername(username: string): Promise<User | null> {
    const user = this.users.find(item => item.username === username);

    if (!user) return null;

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.users.find(item => item.email === email);

    if (!user) return null;

    return user;
  }

  async create(user: User): Promise<void> {
    this.users.push(user);
  }

  async save(user: User): Promise<void> {
    const userIndex = this.users.findIndex(item => item.id.equals(user.id));

    if (userIndex >= 0) {
      this.users[userIndex] = user;
    }
  }
}