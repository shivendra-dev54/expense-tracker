export class DbConnectionError extends Error {
  constructor() {
    super("unable to connect to database!");
  }
}

export class InvalidDataError extends Error {
  constructor(message?: string) {
    super(message || "Invalid data!");
  }
}