import { StatusCode } from "@/lib/status-codes";
import { Request, Response, NextFunction } from "express";
import { ZodError, AnyZodObject, ZodType } from "zod";
import { fromZodError } from "zod-validation-error";

/**
 * Interface defining the structure of request validation schema.
 * Each property represents a different part of the request that can be validated.
 *
 * @interface RequestValidationSchema
 * @property {AnyZodObject} [body] - Schema for validating request body
 * @property {AnyZodObject} [params] - Schema for validating route parameters
 * @property {AnyZodObject} [query] - Schema for validating query parameters
 */
export interface RequestValidationSchema {
  body?: AnyZodObject;
  params?: AnyZodObject;
  query?: AnyZodObject;
}

/**
 * Type that extends Express Request with strongly typed body, params, and query based on the validation schema.
 *
 * @template T - A RequestValidationSchema to provide typing information
 *
 * @typedef ValidatedRequest
 * @property {P} params - Typed route parameters extracted from T["params"]
 * @property {B} body - Typed request body extracted from T["body"]
 * @property {Q} query - Typed query parameters extracted from T["query"]
 */
export type ValidatedRequest<T extends RequestValidationSchema> = Request<
  T["params"] extends ZodType<infer P, any, any> ? P : unknown,
  unknown,
  T["body"] extends ZodType<infer B, any, any> ? B : unknown,
  T["query"] extends ZodType<infer Q, any, any> ? Q : unknown
>;

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
export function validateRequestSchema(schema: RequestValidationSchema) {
  return function (req: Request, res: Response, next: NextFunction) {
    if (!schema)
      return res.error(
        StatusCode.ServerErrorInternal,
        "No request schema found for this route"
      );

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
      if (typeof error === "string")
        return res.error(StatusCode.ClientErrorUnprocessableEntity, error);

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
