import CustomError from "..";

export default class ErrorWithStatusCode {
  static error400(msg: string, redirect?: boolean, debugMessage?: string) {
    const newMessage = msg || "Invalid Request";
    return new CustomError(newMessage, 400, redirect, debugMessage);

    // return new CustomError(newMessage, 401);
  }

  static error401(msg: string, redirect?: boolean, debugMessage?: string) {
    const newMessage = msg || "Unauthorized";
    return new CustomError(newMessage, 401, redirect, debugMessage);

    // return new CustomError(newMessage, 401);
  }

  static error402(msg: string) {
    const newMessage = msg || "Payment Required";
    return new CustomError(newMessage, 402);
  }
  static error403(msg: string, rediret: boolean, debugMessage: string) {
    const newMessage = msg || "Forbidden Request";
    return new CustomError(newMessage, 403, rediret, debugMessage);
  }
  static error404(msg: string) {
    const newMessage = msg || "Request Not found";
    return new CustomError(newMessage, 404);
  }
  static error422(msg: string, redirect: boolean, debugMessage: string) {
    const newMessage = msg || "Unprocessable Entity";
    return new CustomError(newMessage, 422, redirect || false, debugMessage);
  }
  static error429(msg: string) {
    const newMessage = msg || "Too many requests";
    return new CustomError(newMessage, 429);
  }
  static error500(msg: string) {
    const newMessage = msg || "Service is unavailable";
    return new CustomError(newMessage, 500);
  }
}
