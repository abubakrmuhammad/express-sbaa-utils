import { StatusCode } from "@/lib/status-codes";


/**
 * Base class for handling service responses in a type-safe way.
 *
 * @template T - The type of data contained in the response
 *
 * @example
 * ```typescript
 * // Basic usage with type checking
 * const response: ServiceResponse<User> = await userService.getUser(id);
 *
 * if (response.isSuccess()) {
 *   // TypeScript knows response.data is User here
 *   console.log(response.data.name);
 * }
 * ```
 */
export class ServiceResponse<T = unknown> {
  success: boolean;
  statusCode: StatusCode;
  message: string;
  data: T;

  protected constructor(
    success: boolean,
    statusCode: number,
    message: string,
    data: T
  ) {
    this.success = success;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }

  /**
   * Type guard to check if the response is successful
   * @returns {boolean} true if the response is an instance of ServiceSuccess
   *
   * @example
   * ```typescript
   * const response = await userService.getUser(id);
   * if (response.isSuccess()) {
   *   // Access data safely
   *   const userData = response.data;
   * }
   * ```
   */
  isSuccess(): this is ServiceSuccess<T> {
    return this.success === true;
  }

  /**
   * Type guard to check if the response is unsuccessful (Failure or Exception)
   * @returns {boolean} true if the response is either a ServiceFailure or ServiceException
   */
  isUnsuccessful(): this is ServiceFailure<T> | ServiceException<T> {
    return this.success === false;
  }

  /**
   * Type guard to check if the response is a failure
   * @returns {boolean} true if the response is an instance of ServiceFailure
   */
  isFailure(): this is ServiceFailure<T> {
    return this instanceof ServiceFailure;
  }

  /**
   * Type guard to check if the response is an exception
   * @returns {boolean} true if the response is an instance of ServiceException
   */
  isException(): this is ServiceException<T> {
    return this instanceof ServiceException;
  }
}

/**
 * Represents a successful service operation
 * @template T - The type of data contained in the success response
 *
 * @example
 * ```typescript
 * const success = new ServiceSuccess(
 *   { id: 1, name: 'John' },
 *   'User created successfully'
 * );
 * ```
 */
export class ServiceSuccess<T = unknown> extends ServiceResponse<T> {
  declare success: true; // Override with literal true

  constructor(
    data: T,
    message = "Operation successful",
    statusCode = StatusCode.SuccessOK
  ) {
    super(true, statusCode, message, data);
  }
}

/**
 * Represents a failed service operation
 * @template T - The type of error data (defaults to null)
 *
 * @example
 * ```typescript
 * const failure = new ServiceFailure(
 *   'User not found',
 *   404
 * );
 * ```
 */
export class ServiceFailure<T = null> extends ServiceResponse<T> {
  declare success: false; // Override with literal false

  constructor(
    message: string,
    statusCode = StatusCode.ClientErrorBadRequest,
    data: T = null as T
  ) {
    super(false, statusCode, message, data);
  }
}

/**
 * Represents an exceptional service operation (unexpected errors)
 * @template T - The type of error data (defaults to null)
 *
 * @example
 * ```typescript
 * try {
 *   // Some operation
 * } catch (error) {
 *   return new ServiceException(
 *     'Unexpected error occurred',
 *     500,
 *     error
 *   );
 * }
 * ```
 */
export class ServiceException<T = null> extends ServiceResponse<T> {
  declare success: false; // Override with literal false
  error?: unknown;

  constructor(
    message: string,
    statusCode = StatusCode.ServerErrorInternal,
    error?: unknown,
    data: T = null as T
  ) {
    super(false, statusCode, message, data);
    if (error) {
      this.error = error;
    }
  }
}

/**
 * Helper functions for creating and type checking service responses
 *
 * @example
 * ```typescript
 * // Creating responses
 * const successResponse = serviceResponse.success(data);
 * const failureResponse = serviceResponse.failure('Invalid input');
 * const exceptionResponse = serviceResponse.exception('Server error', 500, error);
 *
 * // Type checking
 * if (serviceResponse.isSuccess(response)) {
 *   // Handle success
 * } else if (serviceResponse.isFailure(response)) {
 *   // Handle failure
 * }
 * ```
 */
export const serviceResponse = {
  /**
   * Creates a success response
   * @param data - The success data
   * @param message - Optional success message
   * @param statusCode - Optional HTTP status code (default: 200)
   *
   * @example
   * ```typescript
   * const response = serviceResponse.success({ id: 1, name: 'John' }, 'User created', 201);
   * ```
   */
  success: <T>(data: T, message?: string, statusCode?: StatusCode) =>
    new ServiceSuccess(data, message, statusCode),

  /**
   * Creates a failure response
   * @param message - The failure message
   * @param statusCode - Optional HTTP status code (default: 400)
   * @param data - Optional error data
   *
   * @example
   * ```typescript
   * const response = serviceResponse.failure('User not found', 404, null);
   * ```
   */
  failure: <T = null>(message: string, statusCode?: StatusCode, data?: T) =>
    new ServiceFailure(message, statusCode, data),

  /**
   * Creates an exception response
   * @param message - The error message
   * @param statusCode - Optional HTTP status code (default: 500)
   * @param error - Optional error object
   * @param data - Optional error data
   *
   * @example
   * ```typescript
   * const response = serviceResponse.exception('Unexpected error', 500, error, null);
   * ```
   */
  exception: <T = null>(
    message: string,
    statusCode?: StatusCode,
    error?: unknown,
    data?: T
  ) => new ServiceException(message, statusCode, error, data),
};
