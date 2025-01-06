import {
  RequestValidationSchema,
  ValidatedRequest,
  validateRequestSchema,
} from "@/common/middlewares/request-validation.middleware";
import consola from "consola";
import { NextFunction, Request, Response } from "express";

/**
 * Options for creating a route handler
 */
type CreateRouteHandlerOptions<T extends RequestValidationSchema> = {
  schema: T;
  controller: (req: ValidatedRequest<T>, res: Response) => Promise<any>;
};

/**
 * Creates an Express route handler with proper types
 *
 * @param options - Configuration options for the route handler
 * @param options.controller - The main controller function that handles the route logic
 * @param options.schema - Validation schema for request parameters
 * @returns Array of middleware functions for request validation and handling
 *
 * @example
 * ```typescript
 * // Example usage in a route file
 * import { z } from 'zod';
 *
 * const userSchema = {
 *   body: z.object({
 *     name: z.string(),
 *     email: z.string().email()
 *   })
 * };
 *
 * const createUser = async (req: Request, res: Response) => {
 *   const { name, email } = req.body;
 *   // ... handle user creation
 *   return res.status(201).json({ message: 'User created' });
 * };
 *
 * router.post('/users', createRouteHandler({
 *   controller: createUser,
 *   schema: userSchema
 * }));
 * ```
 */
export function createRouteHandler<T extends RequestValidationSchema>({
  controller,
  schema,
}: CreateRouteHandlerOptions<T>) {
  const schemaValidation = validateRequestSchema(schema);

  const handler = async (req: Request, res: Response) => {
    await controller(req as any, res);
  };

  const catchAll = async (
    err: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction
  ) => {
    consola.error(err);

    return res.error(500, "Something went wrong", { error: err }) as any;
  };

  return [schemaValidation as any, handler, catchAll];
}
