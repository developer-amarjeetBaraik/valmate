/**
 * valmate - A flexible and lightweight Express middleware for validating incoming requests.
 *
 * Accepts an array of custom validation rules, each containing a test function, an optional
 * error message, and an optional status code. It safely validates the request and sends back
 * the appropriate error response if any rule fails. Includes runtime safeguards to prevent
 * misuse outside of an Express route.
 *
 * @function
 * @param {Array<Object>} validations - Array of validation rule objects.
 * @param {Function} validations[].test - A function that receives the Express `req` object and returns `true` if valid, otherwise `false` or `undefined`.
 * @param {string} [validations[].errorMessage='Bad request'] - Custom error message to return if validation fails.
 * @param {number} [validations[].statusCode=400] - HTTP status code to return if validation fails.
 *
 * @returns {Function} Express middleware function `(req, res, next)` to be used in route handlers.
 *
 * @throws {TypeError} If `validations` is not an array.
 * @throws {Error} If the middleware is not used in an Express route (missing `req`, `res`, or `next`).
 *
 * @example
 * import valmate from 'valmate';
 * 
 * app.post('/api/user',
 *   valmate([
 *     { test: (req) => !!req.body.username, errorMessage: 'Username is required' },
 *     { test: (req) => req.body.email?.includes('@'), errorMessage: 'Valid email is required' }
 *   ]),
 *   (req, res) => {
 *     res.send('Request is valid!');
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