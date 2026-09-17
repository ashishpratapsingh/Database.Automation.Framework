import { Knex } from "knex";
import { faker } from "@faker-js/faker";
import { createTestEmployee } from "./employee.builder";

export async function createTestDepartment(db: Knex, employeeId?: number, overrides = {}) {
  let ownerId = employeeId;
  if (!ownerId) {
    const employee = await createTestEmployee(db);
    ownerId = employee.id;
  }

  const defaultDepartmentData = {
    employee_id: ownerId,
    name: faker.name.jobArea(),
    ...overrides,
  };

  const [insertedDepartment] = await db("department").insert(defaultDepartmentData).returning("*");
  return insertedDepartment;
}