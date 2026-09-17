import { Knex } from "knex";
import { faker } from "@faker-js/faker";

export interface UserOverrides {
  name?: string;
  email?: string;
  role?: string;
}

export async function createTestUser(db: Knex, overrides: UserOverrides = {}) {
  const defaultUserData = {
    // Updated for Faker v7 syntax
    name: faker.name.firstName(),
    email: faker.internet.email(),
    role: "customer",
    ...overrides,
  };

  const [insertedUser] = await db("users").insert(defaultUserData).returning("*");
  return insertedUser;
}