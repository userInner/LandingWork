import fs from "fs";
import path from "path";

/**
 * Simple file-based JSON database for MVP.
 * Stores users and their API keys.
 * Upgrade to PostgreSQL/SQLite when scaling.
 */

export interface User {
  email: string;
  apiKey: string;
  createdAt: string;
  requestCount: number;
}

interface Database {
  users: User[];
}

const DB_PATH = path.join(process.cwd(), "data", "users.json");

function ensureDbExists(): void {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify({ users: [] }, null, 2));
  }
}

function readDb(): Database {
  ensureDbExists();
  const raw = fs.readFileSync(DB_PATH, "utf-8");
  return JSON.parse(raw);
}

function writeDb(db: Database): void {
  ensureDbExists();
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

export function getUserByEmail(email: string): User | undefined {
  const db = readDb();
  return db.users.find((u) => u.email === email);
}

export function getUserByApiKey(apiKey: string): User | undefined {
  const db = readDb();
  return db.users.find((u) => u.apiKey === apiKey);
}

export function createUser(params: { email: string; apiKey: string }): User {
  const db = readDb();
  const user: User = {
    email: params.email,
    apiKey: params.apiKey,
    createdAt: new Date().toISOString(),
    requestCount: 0,
  };
  db.users.push(user);
  writeDb(db);
  return user;
}

export function incrementRequestCount(apiKey: string): void {
  const db = readDb();
  const user = db.users.find((u) => u.apiKey === apiKey);
  if (user) {
    user.requestCount++;
    writeDb(db);
  }
}

export function getAllUsers(): User[] {
  const db = readDb();
  return db.users;
}

export function getUserCount(): number {
  const db = readDb();
  return db.users.length;
}
