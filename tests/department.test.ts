import { knex, Knex } from "knex";
import { getTestDatabase, teardownTestDatabase } from "../tests/db-container";
import { createTestEmployee } from "./builders/employee.builder";
import { createTestDepartment } from "./builders/department.builder";

describe("Department & Employee relationship test", () => {

    let db: Knex;

    // Spin up container and run migrations through the strategy pattern
    beforeAll(async () =>{
        db = await getTestDatabase();
    }, 60000);

    //clean database after each test run to make sure every test must get freash database for testing
    afterEach(async () => {
        await db("department").del();
        await db("employee").del();
    });

    // Tear down the database container and destroy the Knex pool
    afterAll(async ()=> {
        await teardownTestDatabase();
    });

    test("should successfully query department belonging to a specific employee name Ashish Singh", async () => {

        //1. Creation of test employee
        const employeeOverrides = {
            firstName: "Ashish",
            lastName: "Singh",
            email: "pratapsinghisking4u@gmail.com"
        }
        const testEmployee = await createTestEmployee(db, employeeOverrides);

        //2. Generate an department tied specifically to that employee
        const departmentOverride = {
            name: "IT",            
        }
        const testDepartment = await createTestDepartment(db, testEmployee.id, departmentOverride);

        //3. Assert relationship and department properties
        expect(testDepartment.employee_id).toBe(testEmployee.id);
        expect(testDepartment.name).toBe("IT");
    });
});