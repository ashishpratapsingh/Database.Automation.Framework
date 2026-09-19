import { Knex } from "knex";
import { faker } from "@faker-js/faker";

export interface CustomersOverrides {
  name?: string;
  email?: string;
  role?: string;
}

export async function createTestCustomer(db: Knex, overrides: CustomersOverrides = {}) {
  const defaultCustomerData = {
    // Updated for Faker v7 syntax
    name: faker.name.firstName(),
    email: faker.internet.email(),
    role: "customer",
    ...overrides,
  };

  const [insertedCustomer] = await db("customers").insert(defaultCustomerData).returning("*");
  return insertedCustomer;
}