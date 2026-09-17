import { Knex } from "knex";
import { getTestDatabase, teardownTestDatabase } from "../tests/db-container";
import { createTestUser } from "./builders/user.builder";
import { createTestOrder } from "./builders/order.builder";
import { expectDatabaseError } from "./helpers/assert-db";

describe("Order & User Relationship Tests", () => {
  let db: Knex;

  beforeAll(async () => {
    // Spin up container and run migrations through the strategy pattern
    db = await getTestDatabase();
  }, 60000); // Increased timeout to 60s for initial Docker image pull/startup

  afterAll(async () => {
    // Tear down the database container and destroy the Knex pool
    await teardownTestDatabase();
  });

  afterEach(async () => {
    // Clear out data after every test to guarantee absolute isolation and prevent pollution
    await db("orders").del();
    await db("users").del();
  });

  test("should successfully query orders belonging to a specific admin user", async () => {
    // 1. Generate an admin user on the fly using the builder
    const adminUser = await createTestUser(db, { 
      role: "admin", 
      name: "Super Admin" 
    });

    // 2. Generate an order tied specifically to that admin user
    const order = await createTestOrder(db, adminUser.id, { 
      status: "completed" 
    });

    // 3. Assert relationship and order properties
    expect(order.user_id).toBe(adminUser.id);
    expect(order.status).toBe("completed");

    // 4. Verify user persistence via database query
    const fetchedUser = await db("users").where({ id: adminUser.id }).first();
    expect(fetchedUser).toBeDefined();
    expect(fetchedUser.name).toBe("Super Admin");
    expect(fetchedUser.role).toBe("admin");
  });

  // <-- 2. Add your negative test case using expectDatabaseError
  test("should fail to create an order for a user ID that does not exist", async () => {
    const nonExistentUserId = 99999;

    await expectDatabaseError(async () => {
      // This violates the foreign key constraint between orders and users
      await createTestOrder(db, nonExistentUserId, { status: "pending" });
    }, "23503"); // '23503' is the standard PostgreSQL error code for foreign_key_violation
  });
  
});