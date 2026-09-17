import { Knex } from "knex";
import { getTestDatabase, teardownTestDatabase } from "./db-container";

describe("Check employee table index (structural existence)", () =>{

    let db:Knex;

    beforeAll(async ()=>{
        db = await getTestDatabase();
    }, 60000);

    afterEach(async ()=>{
        await db("department").del();
        await db("employee").del();
    });

    afterAll(async ()=>{
        await teardownTestDatabase();
    });

    test("Should have existence of index for employee table on email field.", async ()=>{
        const indexCount = await db.raw(`SELECT indexname FROM pg_indexes 
        WHERE tablename = 'employee' AND indexname = 'idx_employee_email';`);
        expect(indexCount.rows.length).toBe(1);
    });
});