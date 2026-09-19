import { Knex } from "knex";
import { DatabaseContainerManager } from "../src/dbContainerManager/DatabaseContainerManager";
import fs from "fs";
import path from "path";

let dbInstance: Knex;

export async function getTestDatabase(): Promise<Knex> {
  if (!dbInstance) {
    const strategy = await DatabaseContainerManager.getStrategy();
    const config = strategy.getConnectionConfig();
    
    dbInstance = require("knex")(config);

    //loading the database dump file
    const baselineSql = fs.readFileSync(
      path.join(__dirname, "../src/dbDump/easyservices-data-dump.sql"),"utf8");
    await dbInstance.raw(baselineSql);
    
    //migrating through the scrips placed in /src/migrations location
    await dbInstance.migrate.latest();
  }
  return dbInstance;
}

export async function teardownTestDatabase(): Promise<void> {
  if (dbInstance) {
    await dbInstance.destroy();    
    (dbInstance as any) = undefined;
  }
  await DatabaseContainerManager.teardown();
}