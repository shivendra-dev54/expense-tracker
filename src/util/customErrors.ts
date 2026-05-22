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

export class NotFoundError extends Error {
  constructor(message?: string) {
    super(message || "Not found!");
  }
}

export class UnauthorizedError extends Error {
  constructor(message?: string) {
    super(message || "Unthorized.");
  }
}

export class HandlableError extends Error {
  constructor(message?: string) {
    super(message || "Something went wrong.");
  }
}