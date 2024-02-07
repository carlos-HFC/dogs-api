export class EqualOldPassword extends Error {
  constructor() {
    super("New password is equal the current password.")
  }
}