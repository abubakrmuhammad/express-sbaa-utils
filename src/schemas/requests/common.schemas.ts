import { z } from "zod";

/**
 * A schema for validating positive integer parameters in (query, path).
 *
 * @description
 * Parameters (query, path) are always strings by default in Express.
 * This schema parses the string to an integer and validates that it is a positive integer.
 * Commonly used for pagination, limits, and other numeric parameters such as id.
 *
 * @type {z.ZodType<number>}
 */
export const positiveIntegerParam = z
  .string()
  .trim()
  .transform((val) => parseInt(val, 10))
  .refine((val) => !isNaN(val) && val > 0, {
    message: "Value must be a positive integer",
  });

/**
 * A schema for validating ISO date strings.
 *
 * @description
 * Useful for validating date strings in query parameters or request bodies.
 * This is defined because query and params are all strings by default in Express.
 *
 * @type {z.ZodType<string>}
 */
export const isoDateString = z
  .string()
  .transform((val) => new Date(val))
  .refine((val) => !isNaN(val.getTime()), {
    message: "Invalid date string",
  })
  .transform((val) => val.toISOString());

/**
 * A schema for validating boolean parameters in (query, path).
 *
 * @description
 * Parameters (query, path) are always strings by default in Express.
 * This schema validates that the value is either "true" or "false".
 * Commonly used for boolean flags in query parameters.
 *
 * @type {z.ZodType<boolean>}
 */
export const booleanParam = z
  .union([z.literal("true"), z.literal("false"), z.boolean()])
  .transform((val) => {
    if (val === "true") return true;
    if (val === "false") return false;
    return val;
  });

/**
 * A schema for validating UUID strings.
 *
 * @description
 * Useful for validating UUID strings in query parameters or request bodies.
 *
 * @type {z.ZodType<string>}
 */
export const uuidParam = z.string().uuid();

/**
 * A schema for validating MongoDB ObjectId strings.
 *
 * @description
 * Validates that a string is a valid MongoDB ObjectId.
 * Used for document IDs in MongoDB collections.
 *
 * @type {z.ZodType<string>}
 */
export const objectIdParam = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId format");

/**
 * Common sort orders used across the application
 */
export const sortOrderSchema = z.enum(["asc", "desc"]).default("desc");

/**
 * Defines the fields for pagination query parameters.
 *
 * @property {positiveIntegerParam} page - Optional page number parameter.
 * @property {positiveIntegerParam} limit - Optional limit parameter to specify the number of items per page.
 */
export const paginationQueryFields = {
  page: positiveIntegerParam.optional(),
  limit: positiveIntegerParam.optional(),
};
