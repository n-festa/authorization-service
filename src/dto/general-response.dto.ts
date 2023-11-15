export class GeneralResponse {
  constructor(statusCode: number, message: any) {
    this.statusCode = statusCode;
    this.message = message;
  }

  statusCode: number;
  message: any;
}
