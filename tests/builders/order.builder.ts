import { Knex } from "knex";
import { createTestUser } from "./user.builder";
import { faker } from "@faker-js/faker";

export async function createTestOrder(db: Knex, userId?: number, overrides = {}) {
  let ownerId = userId;
  if (!ownerId) {
    const user = await createTestUser(db);
    ownerId = user.id;
  }

  const defaultOrderData = {
    user_id: ownerId,
    total_amount: parseFloat(faker.finance.amount(10, 500, 2)),
    status: "pending",
    ...overrides,
  };

  const [insertedOrder] = await db("orders").insert(defaultOrderData).returning("*");
  return insertedOrder;
}