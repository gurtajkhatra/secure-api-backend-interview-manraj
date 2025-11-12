import fs from "fs";
import path from "path";

// File-based persistence for development (replace with database in production)
const DEV_STORAGE_FILE = path.join(__dirname, "../.dev-users.json");

export interface User {
  email: string;
  passwordHash: string;
}

export function loadUsers(): Map<string, User> {
  try {
    if (fs.existsSync(DEV_STORAGE_FILE)) {
      console.log(`Loading users from disk: ${DEV_STORAGE_FILE}`);
      const data = fs.readFileSync(DEV_STORAGE_FILE, "utf-8");
      const parsed = JSON.parse(data);
      return new Map(Object.entries(parsed));
    }
  } catch (error) {
    console.error("Failed to load users from disk:", error);
  }
  return new Map();
}

export function saveUsers(users: Map<string, User>) {
  try {
    console.log(`Saving users to disk: ${JSON.stringify(users)}`);
    const obj = Object.fromEntries(users);
    fs.writeFileSync(DEV_STORAGE_FILE, JSON.stringify(obj, null, 2));
  } catch (error) {
    console.error("Failed to save users to disk:", error);
  }
}

// ------------------------------------------------------------
// Save users on process exit/restart
// ------------------------------------------------------------
export function setupExitHandlers(users: Map<string, User>) {
  let isShuttingDown = false;

  const handleExit = () => {
    if (isShuttingDown) return;
    isShuttingDown = true;
    console.log("Shutting down - saving users...");
    saveUsers(users);
  };

  process.on("SIGINT", () => {
    handleExit();
    process.exit(0);
  });

  process.on("SIGTERM", () => {
    handleExit();
    process.exit(0);
  });

  // For hot reloads with nodemon/ts-node-dev
  process.once("SIGUSR2", () => {
    handleExit();
    process.kill(process.pid, "SIGUSR2");
  });
}
