
# Valmate 🧪

**Valmate** is a safe, flexible, and lightweight Express.js middleware to validate incoming requests using simple custom rules. It also includes safeguards to prevent incorrect usage outside of Express route handlers.

---

## 🚀 Installation

```bash
npm install valmate
```

---

## 📦 Usage

```js
import express from 'express';
import valmate from 'valmate';

const app = express();
app.use(express.json());

app.post(
  '/api/user',
  valmate([
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

### `valmate(validations: Array)`

| Field          | Type               | Required | Default         | Description                               |
| -------------- | ------------------ | -------- | --------------- | ----------------------------------------- |
| `test`         | `(req) => boolean` | ✅        | —               | Function that checks the request validity |
| `errorMessage` | `string`           | ❌        | `'Bad request'` | Message to return if validation fails     |
| `statusCode`   | `number`           | ❌        | `400`           | HTTP status to return if validation fails |


Returns an Express middleware function `(req, res, next) => {}`

---
## ✅ Example with Custom Status Code
```js
valmate([
  {
    test: (req) => req.body.token === 'secret',
    errorMessage: 'Unauthorized access',
    statusCode: 401,
  },
]);

```
---

## 🧪 Runtime Safeguards

Valmate includes checks to make sure it’s used properly:

✅ Throws if validations is not an array

✅ Throws if used outside of an Express route handler

✅ Logs a warning if a validation rule is missing or invalid

You'll see helpful errors like:

```
[valmate] Middleware must be used in an Express route. Check if you are calling it outside of Express context.
```

---

## 💡 Why use Valmate?


- ⚡ Lightweight and dependency-free

- 🧠 Simple rule-based logic

- 🧱 Plug-and-play in Express routes

- 🛡 Clear error messages and runtime protection

---

## 📄 License

MIT License  
© 2025 [Amarjeet Baraik](https://github.com/developer-amarjeetBaraik)
