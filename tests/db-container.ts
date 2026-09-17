import { Knex } from "knex";
import { DatabaseContainerManager } from "../src/dbContainerManager/DatabaseContainerManager";

let dbInstance: Knex;

export async function getTestDatabase(): Promise<Knex> {
  if (!dbInstance) {
    const strategy = await DatabaseContainerManager.getStrategy();
    const config = strategy.getConnectionConfig();
    
    dbInstance = require("knex")(config);
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