import { Knex } from "knex";
import { createTestCustomer } from "./customer.builder";
import { faker } from "@faker-js/faker";

export async function createTestOrder(db: Knex, customerId?: number, overrides = {}) {
  let ownerId = customerId;
  if (!ownerId) {
    const customer = await createTestCustomer(db);
    ownerId = customer.id;
  }

  const defaultOrderData = {
    customer_id: ownerId,
    total_amount: parseFloat(faker.finance.amount(10, 500, 2)),
    status: "pending",
    ...overrides,
  };

  const [insertedOrder] = await db("orders").insert(defaultOrderData).returning("*");
  return insertedOrder;
}