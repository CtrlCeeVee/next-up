export class AppError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AppError";
  }
}

export class NetworkError extends AppError {
  constructor(message: string = "Network error occurred") {
    super(message);
    this.name = "NetworkError";
  }
}

export class AuthError extends AppError {
  constructor(message: string = "Authentication error") {
    super(message);
    this.name = "AuthError";
  }
}
