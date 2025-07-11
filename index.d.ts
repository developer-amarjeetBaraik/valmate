
/**
 * Type definitions for valmate
 * Author: Amarjeet Baraik
 */

import { Request, Response, NextFunction } from 'express';

/**
 * A single validation rule.
 */
export interface ValidationRule {
  /**
   * The validation function that receives the Express request.
   * Should return true if valid, false/undefined if invalid.
   */
  test: (req: Request) => boolean;

  /**
   * Error message to return when validation fails.
   * @default "Bad request"
   */
  errorMessage?: string;

  /**
   * HTTP status code to return if validation fails.
   * @default 400
   */
  statusCode?: number;
}

/**
 * Middleware generator to validate Express requests.
 * Throws a descriptive error if called outside of a valid Express context.
 *
 * @param validations - Array of validation rules.
 * @returns Express middleware function.
 */
declare function validateRequest(validations: ValidationRule[]): (req: Request, res: Response, next: NextFunction) => void;

export default validateRequest;
