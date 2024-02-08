export class EqualOldPassword extends Error {
  constructor() {
    super("New password can not be equal than current password.");
  }
}