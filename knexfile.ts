/* Use this file for Local dev and production beacuse they use fixed ports and persistent databases, so a static configuration file makes total sense there. */
import type { Knex } from "knex";
import path from "path";

const knexConfig: { [key: string]: Knex.Config } = {
  development: {
    client: "pg",
    connection: process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/test_db",
    migrations: {
      directory: path.resolve(__dirname, "src/migrations"),
      extension: "ts",
    },
    seeds: {
      directory: path.resolve(__dirname, "src/seeds"),
      extension: "ts",
    },
  },
};

export default knexConfig;