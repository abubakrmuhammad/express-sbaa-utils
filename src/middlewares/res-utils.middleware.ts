import { Request, Response, NextFunction } from "express";

/**
 * Middleware that adds utility methods to the Response object.
 *
 * @returns Express middleware function that adds success and error response helpers
 *
 * @example
 * const app = express();
 * app.use(addResUtils());
 *
 * app.get("/test", async (req, res) => {
 *  res.success("Hello, world!");
 * });
 */
export function addResUtils() {
  return function addResUtils(
    _req: Request,
    res: Response,
    next: NextFunction
  ) {
    res.success = success.bind(res);
    res.error = error.bind(res);

    next();
  };
}

/**
 * Sends a success response with optional message and data.
 *
 * @param statusCodeOrMessage - HTTP status code or message string
 * @param messageOrData - Message string when status code is provided, or data object
 * @param data - Optional data object when status code and message are provided
 *
 * @returns Response object
 */
function success(
  this: Response,
  statusCodeOrMessage: number | string,
  messageOrData?: string | any,
  data?: any
) {
  if (typeof statusCodeOrMessage === "number") {
    return this.status(statusCodeOrMessage).json({
      success: true,
      message: messageOrData as string,
      ...(data && { data }),
    });
  }

  return this.status(200).json({
    success: true,
    message: statusCodeOrMessage,
    ...(messageOrData && { data: messageOrData }),
  });
}

/**
 * Sends an error response with status code, message and optional data.
 *
 * @param statusCode - HTTP status code
 * @param message - Error message
 * @param data - Optional error data
 *
 * @returns Response object
 */
function error(
  this: Response,
  statusCode: number,
  message: string,
  data?: any
) {
  return this.status(statusCode).json({
    success: false,
    message,
    ...(data && { data }),
  });
}
