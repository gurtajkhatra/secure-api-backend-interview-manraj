# Interview Requirements

Implement the baseline authentication features during the session starting from the single `src/auth-server.ts` file (all helpers are stubs inside that file):

- `POST /api/auth/register`: Accept user credentials, validate input, hash the password (e.g., with `bcrypt`), and persist the account.
- `POST /api/auth/login`: Verify stored credentials, respond with a signed JWT via the `generateToken` stub, and handle failure states clearly.
- JWT helpers: Flesh out `generateToken` and `verifyToken` (expiry, claims, error handling) and discuss how you would secure secrets across environments.
- `GET /api/auth/verify`: Validate the `Authorization` bearer token with `verifyToken` and return the decoded payload.
- `GET /api/protected`: Example route that requires a valid JWT before returning protected data.
- Basic rate limiting: Implement the `rateLimit` middleware using the in-memory `rateLimitStore`, and describe how you would shift this to a distributed store in production.

Also be prepared to:

- Walk through expected edge cases, security threats, and validation concerns before writing code.
- Discuss production deployment considerations like secrets management, persistence strategy, monitoring, and scaling.
- Explain trade-offs you make while prioritizing features within the interview timebox.

## Helpful Commands

Registration:
```
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"SecurePass123!"}'
```

Login:
```
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"SecurePass123!"}'
```

Verify (replace `YOUR_TOKEN`):
```
curl -X GET http://localhost:3000/api/auth/verify \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Rate limit spike:
```
for i in {1..20}; do
  curl -X POST http://localhost:3000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"wrong"}' &
done
wait
```

