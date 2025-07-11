
# Valmate 🧪

**Valmate** is a simple and flexible Express.js middleware to validate incoming requests using custom rule functions. It also includes safeguards to prevent incorrect usage outside of Express routes.

---

## 🚀 Installation

```bash
npm install valmate
```

---

## 📦 Usage

```js
import express from 'express';
import validateRequest from 'valmate';

const app = express();
app.use(express.json());

app.post(
  '/api/user',
  validateRequest([
    {
      test: (req) => !!req.body.username,
      errorMessage: 'Username is required',
    },
    {
      test: (req) => req.body.email?.includes('@'),
      errorMessage: 'Valid email is required',
    },
  ]),
  (req, res) => {
    res.json({ success: true, message: 'Data is valid!' });
  }
);
```

---

## 🧰 API

### `validateRequest(validations: Array)`

- **validations**: An array of objects:
  - `test(req)` — function that returns `true` if valid
  - `errorMessage` — string message if validation fails (default: `"Bad request"`)
  - `statusCode` — optional HTTP error code (default: `400`)

Returns an Express middleware function `(req, res, next) => {}`

---

## 🧪 Runtime Safeguards

Valmate automatically detects incorrect usage. If you try to use the middleware outside of an Express route (e.g., call it directly), you'll see a clear error message like:

```
[valmate] Middleware must be used in an Express route. Check if you are calling it outside of Express context.
```

---

## ✅ Example with status codes

```js
validateRequest([
  {
    test: (req) => req.body.token === 'secret',
    errorMessage: 'Unauthorized access',
    statusCode: 401,
  },
]);
```

---

## 💡 Why use Valmate?

- ✅ Lightweight and framework-agnostic logic
- ✅ Easy to plug into any Express route
- ✅ Custom validations per route
- ✅ Clear error messages and runtime protection

---

## 📄 License

MIT License  
© 2025 [Amarjeet Baraik](https://github.com/your-username)
