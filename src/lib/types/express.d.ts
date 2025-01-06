import { Response } from "express";
import StatusCode from "status-code-enum";

declare global {
  namespace Express {
    interface Response {
      /**
       * Sends a JSON success response
       *
       * @param message Success message
       * @param data Optional data to send
       *
       * @example
       * res.success('User retrieved successfully', { user: { id: 1, name: 'John' } });
       * // Response: { "success": true, "message": "User retrieved successfully", "data": { "user": { "id": 1, "name": "John" } } }
       */
      success(message: string, data?: any): Response;
      /**
       * Sends a JSON success response with custom status code
       *
       * @param statusCode HTTP status code
       * @param message Success message
       * @param data Optional data to send
       *
       * @example
       * res.success(201, 'User created successfully', { user: { id: 1, name: 'John' } });
       * // Response: { "success": true, "message": "User created successfully", "data": { "user": { "id": 1, "name": "John" } } }
       */
      success(statusCode: StatusCode, message: string, data?: any): Response;

      /**
       * Sends a JSON error response with status code and message
       *
       * @param statusCode HTTP status code
       * @param message Error message
       * @param data Optional error details
       *
       * @example
       * res.error(404, 'User not found');
       * // Response: { "success": false, "message": "User not found" }
       * @example
       * res.error(400, 'Validation failed', { field: 'email', message: 'Invalid email' });
       * // Response: { "success": false, "message": "Validation failed", "data": { "field": "email", "message": "Invalid email" } }
       */
      error(statusCode: StatusCode, message: string, data?: any): Response;
    }
  }
}
