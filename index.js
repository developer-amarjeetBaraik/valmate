/**
 * Middleware generator to validate Express requests using custom validation rules.
 * 
 * @function
 * @param {Array<Object>} validations - An array of validation rule objects.
 * @param {Function} validations[].test - A function that receives the Express `req` object and returns `true` if valid, otherwise `false` or `undefined`.
 * @param {string} [validations[].errorMessage='Bad request'] - Error message to return if validation fails.
 * @param {number} [validations[].statusCode=400] - HTTP status code to return if validation fails.
 * 
 * @returns {Function} Express middleware function `(req, res, next)`.
 * 
 * @example
 * import valmate from './valmate.js';
 * 
 * app.post('/api/user', 
 *   valmate([
 *     { test: req => !!req.body.username, errorMessage: 'Username is required' },
 *     { test: req => req.body.email?.includes('@'), errorMessage: 'Valid email is required' }
 *   ]),
 *   (req, res) => {
 *     res.send('Request is valid');
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
                    return res.statusCode(statusCode).json({
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