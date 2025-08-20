export class APIError extends Error {
  public code: number;
  public message: string;
  public detail: unknown;
  constructor(code: number, message: string, detail?: unknown) {
    super();
    this.code = code;
    this.message = message;
    this.detail = detail;
  }
}
