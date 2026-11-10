export default class CustomError extends Error {
  statusCode: number;
  newMessage: string;
  redirect: boolean;
  debugMessage: string;
  constructor(
    message: string,
    statusCode: number,
    redirect?: boolean,
    debugMessage?: string
  ) {
    super(message);
    this.statusCode = statusCode || 401;
    this.newMessage = message;
    this.name = "customError";
    this.redirect = !!redirect;
    this.debugMessage = debugMessage || message;
  }
}
