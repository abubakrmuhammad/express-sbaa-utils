import { Request, Response, NextFunction } from "express";
import { ZodError, AnyZodObject } from "zod";
import { fromZodError } from "zod-validation-error";

interface ValidationSchema {
  body?: AnyZodObject;
  params?: AnyZodObject;
  query?: AnyZodObject;
}

/**
 * Middleware to validate request schema (body, params, query) using Zod.
 *
 * @param {Object} schema - The schema object to validate against.
 * @param {Object} [schema.body] - The schema for the request body.
 * @param {Object} [schema.params] - The schema for the request parameters.
 * @param {Object} [schema.query] - The schema for the request query.
 *
 * @returns {Function} Middleware function to validate the request.
 *
 * @example
 * const { z } = require("zod");
 *
 * const createMeetingSchema = {
 *   body: z.object({
 *     title: z.string().min(3).max(255),
 *     description: z.string().min(3).max(255),
 *   }),
 * };
 *
 * router.post(
 *   "/meetings",
 *   validateRequestSchema(createMeetingSchema),
 *   createMeeting
 * );
 */
export function validateRequestSchema(schema: ValidationSchema) {
  return function (req: Request, res: Response, next: NextFunction) {
    if (!schema)
      return res.error(500, "No request schema found for this route");

    try {
      const { body, params, query } = schema;

      try {
        if (params) req.params = params.parse(req.params);
      } catch (e) {
        throw formatErrorMessage(e as ZodError, "Params");
      }

      try {
        if (query) req.query = query.parse(req.query);
      } catch (e) {
        throw formatErrorMessage(e as ZodError, "Query");
      }

      try {
        if (body) req.body = body.parse(req.body);
      } catch (e) {
        throw formatErrorMessage(e as ZodError, "Body");
      }

      next();
    } catch (error) {
      if (typeof error === "string") return res.error(422, error);

      return res.error(500, "Something went wrong", error);
    }
  };
}

/**
 * Formats the error message from Zod validation errors.
 *
 * @param {ZodError} error - The Zod error object.
 * @param {string} location - The location of the error (e.g., "Params", "Query", "Body").
 *
 * @returns {string} The formatted error message.
 *
 * @example
 * const schema = z.object({
 *  id: z.number(),
 * });
 *
 * try {
 *   schema.parse({ id: "abc" });
 * } catch (error) {
 *   console.log(formatErrorMessage(error, "Params"));
 * }
 *
 * // Output: "Invalid value in [Params]: Value must be a number"
 */
function formatErrorMessage(error: ZodError, location: string): string {
  const validationErrorMessage = fromZodError(error).message;
  const [indicator, errors] = validationErrorMessage.split(":");

  return `${indicator} in [${location}]: ${errors}`;
}
