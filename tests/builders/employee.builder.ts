import { Knex } from "knex";
import { faker } from "@faker-js/faker";

export interface EmployeeOverrides {
    firstName?: string; 
    lastName?: string;
    email?: string;
}

export async function createTestEmployee(db: Knex, overrides: EmployeeOverrides = {}) {
  const defaultEmployeeData = {
    // Updated for Faker v7 syntax
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),    
    ...overrides,
  };

  const [insertedEmployee] = await db("employee").insert(defaultEmployeeData).returning("*");
  return insertedEmployee;
}