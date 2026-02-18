export interface ApiErrorResponse {
  statusCode: number;
  message: string;
  details: string | null;
}

export class ApiError extends Error implements ApiErrorResponse {
  statusCode: number;
  details: string | null;

  constructor(statusCode: number, message: string, details: string | null) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.details = details;
  }
}
