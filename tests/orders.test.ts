import { Knex } from "knex";
import { getTestDatabase, teardownTestDatabase } from "../tests/db-container";
import { createTestCustomer } from "./builders/customer.builder";
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
    await db("customers").del();
  });

  test("should successfully query orders belonging to a specific admin customer", async () => {
    // 1. Generate an admin customer on the fly using the builder
    const adminCustomer = await createTestCustomer(db, { 
      role: "admin", 
      name: "Super Admin" 
    });

    // 2. Generate an order tied specifically to that admin customer
    const order = await createTestOrder(db, adminCustomer.id, { 
      status: "completed" 
    });

    // 3. Assert relationship and order properties
    expect(order.customer_id).toBe(adminCustomer.id);
    expect(order.status).toBe("completed");

    // 4. Verify customer persistence via database query
    const fetchedCustomer = await db("customers").where({ id: adminCustomer.id }).first();
    expect(fetchedCustomer).toBeDefined();
    expect(fetchedCustomer.name).toBe("Super Admin");
    expect(fetchedCustomer.role).toBe("admin");
  });

  // <-- 2. Add your negative test case using expectDatabaseError
  test("should fail to create an order for a customer ID that does not exist", async () => {
    const nonExistentCustomerId = 99999;

    await expectDatabaseError(async () => {
      // This violates the foreign key constraint between orders and customers
      await createTestOrder(db, nonExistentCustomerId, { status: "pending" });
    }, "23503"); // '23503' is the standard PostgreSQL error code for foreign_key_violation
  });
  
});