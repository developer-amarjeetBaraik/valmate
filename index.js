/**
 * valmate - A flexible and lightweight Express middleware for validating incoming requests.
 *
 * Accepts an array of validation rule objects. Each object defines a `test` function
 * (which checks a condition on the `req` object), an optional `errorMessage`, and
 * an optional `statusCode`. If any test fails, the request is short-circuited with
 * a response containing the provided message and status.
 *
 * 🚨 This middleware includes safeguards to ensure it is used **only within**
 * a valid Express route (i.e., with `req`, `res`, `next`).
 *
 * ---
 *
 * @function
 * @param {Array<Object>} validations - An array of validation rule objects.
 *
 * Each object can contain:
 * @param {Function} validations[].test - Required. A function that receives the Express `req` object and returns `true` if valid, or `false`/`undefined` if invalid.
 * @param {string} [validations[].errorMessage='Bad request'] - Optional. Custom error message sent if validation fails.
 * @param {number} [validations[].statusCode=400] - Optional. HTTP status code sent if validation fails.
 *
 * @returns {Function} An Express middleware function `(req, res, next)` to be used in route definitions.
 *
 * @throws {TypeError} If `validations` is not an array.
 * @throws {Error} If used outside of an Express route (missing or invalid `req`, `res`, or `next`).
 *
 * ---
 *
 * @example
 * import express from 'express';
 * import valmate from 'valmate';
 *
 * const app = express();
 * app.use(express.json());
 *
 * app.post('/signup',
 *   valmate([
 *     {
 *       test: req => !!req.body.username,
 *       errorMessage: 'Username is required',
 *       statusCode: 422
 *     },
 *     {
 *       test: req => req.body.password?.length >= 6,
 *       errorMessage: 'Password must be at least 6 characters'
 *     }
 *   ]),
 *   (req, res) => {
 *     res.status(200).send('Validation passed!');
 *   }
 * );
 */
const valmate = (validations = [{ test: () => { }, errorMessage: String || 'Bad request', statusCode: Number || 400 }]) => {
    return ((req, res, next) => {
        try {
            if (!Array.isArray(validations)) {
                throw new TypeError('[valmate] Expected an array of validation rules.');
            }

            if (
                typeof req !== 'object' ||
                typeof res !== 'object' ||
                typeof next !== 'function' ||
                typeof res.status !== 'function' ||
                typeof res.json !== 'function'
            ) {
                throw new Error(
                    '[valmate] Middleware must be used in an Express route. Check if you are calling it outside of Express context.'
                );
            }

            for (const { test, errorMessage } of validations) {
                if (typeof test !== 'function') {
                    console.warn('Warning: A validation "test" is not a function.');
                    continue; // skip invalid test
                }
                const isValid = test(req)
                if (!isValid) {
                    return res.status(statusCode).json({
                        status: statusCode,
                        message: errorMessage
                    })
                }
            }
            next()
        } catch (err) {
            console.error('Validation middleware error:', err.message);
            return res.status(500).json({
                status: 500,
                message: 'Internal server error'
            });
        }

    })
}

export default valmate