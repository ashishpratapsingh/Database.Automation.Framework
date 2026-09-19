import { Knex } from "knex";
import { getTestDatabase, teardownTestDatabase } from "./db-container";

describe("Check easyservices users table index (structural existence)", () =>{

    let db:Knex;

    beforeAll(async ()=>{
        db = await getTestDatabase();
    }, 60000);    

    afterAll(async ()=>{
        await teardownTestDatabase();
    });

    test("Should have existence of index for users table on email field.", async ()=>{
        const indexCount = await db.raw(`SELECT indexname FROM pg_indexes 
        WHERE tablename = 'users' AND indexname = 'users_users_email_e6659159_like';`);
        expect(indexCount.rows.length).toBe(1);
    });
});