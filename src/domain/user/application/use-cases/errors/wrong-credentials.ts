export class WrongCredentials extends Error {
  constructor() {
    super("Incorrect credentials.")
  }
}