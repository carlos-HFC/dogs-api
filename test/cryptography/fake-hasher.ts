import { HashComparer } from "@/domain/user/application/cryptography/hash-comparer";
import { HashGenerator } from "@/domain/user/application/cryptography/hash-generator";

export class FakeHasher implements HashGenerator, HashComparer {
  private HASH = "-hashed";

  async hash(plain: string): Promise<string> {
    return plain.concat(this.HASH);
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return plain.concat(this.HASH) === hash;
  }
}