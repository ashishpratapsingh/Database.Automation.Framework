import { PostgreSqlContainer, StartedPostgreSqlContainer } from "@testcontainers/postgresql";
import { Knex } from "knex";
import { IDatabaseStrategy } from "./interfaces/IDatabaseStrategy";
import path from "path";
import knexConfig from '../../knexfile';

export class PostgresStrategy implements IDatabaseStrategy {
  private container?: StartedPostgreSqlContainer;

  async start() {
    this.container = await new PostgreSqlContainer("postgres:18-alpine")
    .withEnvironment({
      POSTGRES_USER: "postgres"
    })        
    .start();
  }

  getConnectionConfig(): Knex.Config {
    
    let config:Knex.Config;

    if (!this.container) throw new Error("Postgres container not started");
    //if database location is development/production relies on hardcoded values the get the config from knexfile.ts
    let dbLocation = process.env.DATABASE_URL;
    if(dbLocation == "local")
    {
      config = {     
        ...knexConfig.development,
      };
    }
    else
    {      
      config = {     
        client: "pg",      
        connection: this.container.getConnectionUri(),        
        migrations: {
          directory: path.resolve(__dirname, "../migrations"),        
          extension: "ts",
        }
      };   
    }

    return config;
  }

  async stop() {
    if (this.container) await this.container.stop();
  }
}