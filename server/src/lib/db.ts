import fs from "fs";
import path from "path";

export interface User {
  email: string;
  apiKey: string;
  createdAt: string;
  requestCount: number;
}

interface Database { users: User[]; }

const DB_PATH = path.join(process.cwd(), "data", "users.json");

function ensureDb(): void {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DB_PATH)) fs.writeFileSync(DB_PATH, JSON.stringify({ users: [] }, null, 2));
}

function read(): Database { ensureDb(); return JSON.parse(fs.readFileSync(DB_PATH, "utf-8")); }
function write(db: Database): void { ensureDb(); fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2)); }

export function getUserByEmail(email: string): User | undefined { return read().users.find(u => u.email === email); }
export function getUserByApiKey(apiKey: string): User | undefined { return read().users.find(u => u.apiKey === apiKey); }

export function createUser(email: string, apiKey: string): User {
  const db = read();
  const user: User = { email, apiKey, createdAt: new Date().toISOString(), requestCount: 0 };
  db.users.push(user);
  write(db);
  return user;
}
