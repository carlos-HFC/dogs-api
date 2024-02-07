export class ConfirmPasswordNotMatch extends Error {
  constructor() {
    super("New password and confirm password not match.")
  }
}