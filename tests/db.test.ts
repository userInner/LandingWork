import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "fs";
import path from "path";
import {
  createUser,
  getUserByEmail,
  getUserByApiKey,
  incrementRequestCount,
  getUserCount,
} from "@/lib/db";

const TEST_DB_DIR = path.join(process.cwd(), "data");
const TEST_DB_PATH = path.join(TEST_DB_DIR, "users.json");

describe("File Database", () => {
  beforeEach(() => {
    // Clean slate for each test
    if (fs.existsSync(TEST_DB_PATH)) {
      fs.unlinkSync(TEST_DB_PATH);
    }
  });

  afterEach(() => {
    // Cleanup
    if (fs.existsSync(TEST_DB_PATH)) {
      fs.unlinkSync(TEST_DB_PATH);
    }
  });

  describe("createUser", () => {
    it("should create a user and return it", () => {
      const user = createUser({ email: "test@example.com", apiKey: "sf_abc123" });
      expect(user.email).toBe("test@example.com");
      expect(user.apiKey).toBe("sf_abc123");
      expect(user.requestCount).toBe(0);
      expect(user.createdAt).toBeDefined();
    });

    it("should persist user to disk", () => {
      createUser({ email: "persist@test.com", apiKey: "sf_persist" });
      const raw = fs.readFileSync(TEST_DB_PATH, "utf-8");
      const db = JSON.parse(raw);
      expect(db.users).toHaveLength(1);
      expect(db.users[0].email).toBe("persist@test.com");
    });
  });

  describe("getUserByEmail", () => {
    it("should find existing user by email", () => {
      createUser({ email: "find@test.com", apiKey: "sf_find" });
      const user = getUserByEmail("find@test.com");
      expect(user).toBeDefined();
      expect(user!.apiKey).toBe("sf_find");
    });

    it("should return undefined for non-existent email", () => {
      const user = getUserByEmail("ghost@test.com");
      expect(user).toBeUndefined();
    });
  });

  describe("getUserByApiKey", () => {
    it("should find existing user by API key", () => {
      createUser({ email: "key@test.com", apiKey: "sf_lookup" });
      const user = getUserByApiKey("sf_lookup");
      expect(user).toBeDefined();
      expect(user!.email).toBe("key@test.com");
    });

    it("should return undefined for non-existent key", () => {
      const user = getUserByApiKey("sf_nonexistent");
      expect(user).toBeUndefined();
    });
  });

  describe("incrementRequestCount", () => {
    it("should increment request count", () => {
      createUser({ email: "count@test.com", apiKey: "sf_count" });
      incrementRequestCount("sf_count");
      incrementRequestCount("sf_count");
      const user = getUserByApiKey("sf_count");
      expect(user!.requestCount).toBe(2);
    });
  });

  describe("getUserCount", () => {
    it("should return 0 for empty db", () => {
      expect(getUserCount()).toBe(0);
    });

    it("should return correct count", () => {
      createUser({ email: "a@test.com", apiKey: "sf_a" });
      createUser({ email: "b@test.com", apiKey: "sf_b" });
      expect(getUserCount()).toBe(2);
    });
  });
});
