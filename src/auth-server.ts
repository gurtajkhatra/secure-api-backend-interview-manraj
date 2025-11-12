import express, { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { loadUsers, setupExitHandlers, User } from "./storage";

dotenv.config();

const app = express();
app.use(express.json());

const users: Map<string, User> = loadUsers();

// Setup handlers to save users on process exit/restart
setupExitHandlers(users);

// TODO: Move rate limiting state to durable storage (Redis, Memcached, etc.) for multi-instance deployments.
const rateLimitStore = new Map<string, number[]>();

const JWT_SECRET =
  process.env.JWT_SECRET || "development-secret-change-in-production";
const PORT = Number(process.env.PORT) || 3000;

app.use(rateLimit);

app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.post("/api/auth/register", async (req: Request, res: Response) => {
  // TODO: Register user
  res.status(501).json({ error: "Not implemented" });
});

app.post("/api/auth/login", async (req: Request, res: Response) => {
  // TODO: Issue JWT
  res.status(501).json({ error: "Not implemented" });
});

app.get("/api/auth/verify", async (req: Request, res: Response) => {
  // TODO: return a decoded JWT payload
  res.status(501).json({ error: "Not implemented" });
});

app.get("/api/protected", async (req: Request, res: Response) => {
  // TODO: Protect this route by validating JWT before returning protected data
  res.status(501).json({ error: "Not implemented" });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Error:", err);
  if (res.headersSent) {
    return next(err);
  }
  res.status(500).json({ error: "Internal server error" });
});

function generateToken(payload: object): string {
  // TODO: Implement JWT signing (consider expiry, audience, issuer, etc.)
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "15m" });
}

function verifyToken(token: string): any {
  // TODO: Implement JWT verification (consider error handling and revocation strategy)
  return jwt.verify(token, JWT_SECRET);
}

async function rateLimit(req: Request, res: Response, next: NextFunction) {
  // TODO: Track request timestamps per identifier (e.g., IP)
  return next();
}

export { app };

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Auth server running on port ${PORT}`);
  });
}
