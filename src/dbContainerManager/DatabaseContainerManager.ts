import { IDatabaseStrategy } from "../databaseStrategy/interfaces/IDatabaseStrategy";
import { PostgresStrategy } from "../databaseStrategy/PostgresStrategy";

export class DatabaseContainerManager {
  private static strategy: IDatabaseStrategy;

  static async getStrategy(): Promise<IDatabaseStrategy> {
    if (!this.strategy) {
      const dbClient = process.env.DB_CLIENT || "pg";

      switch (dbClient) {
        case "pg":
        case "postgres":
          this.strategy = new PostgresStrategy();
          break;
        // Future extensions can easily plug in here:
        // case "mysql":
        //   this.strategy = new MySqlStrategy();
        //   break;
        default:
          throw new Error(`Unsupported database client strategy: ${dbClient}`);
      }

      await this.strategy.start();
    }
    return this.strategy;
  }

  static async teardown(): Promise<void> {
    if (this.strategy) {
      await this.strategy.stop();
      // Reset instance so subsequent test files can re-initialize cleanly if needed
      (this.strategy as any) = undefined; 
    }
  }
}