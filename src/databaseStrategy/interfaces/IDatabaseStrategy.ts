import { Knex } from "knex";

export interface IDatabaseStrategy {
  start(): Promise<void>;
  getConnectionConfig(): Knex.Config;
  stop(): Promise<void>;
}