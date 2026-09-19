import { Knex } from "knex";

// This will be called ny knex when dbInstance.migrate.latest() called by db-container.ts
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("customers", (table) => {
    table.increments("id").primary();
    table.string("email").notNullable().unique();
    table.string("name");
    table.string("role").defaultTo("customer");
    table.timestamps(true, true);
  });

  await knex.schema.createTable("orders", (table) => {
    table.increments("id").primary();
    table.integer("customer_id").unsigned().references("id").inTable("customers").onDelete("CASCADE");
    table.decimal("total_amount", 10, 2).notNullable();
    table.string("status").defaultTo("pending");
    table.timestamps(true, true);
  });

  //create employee table
  await knex.schema.createTable("employee", (table) => {
    table.increments("id").primary();    
    table.string("firstName").notNullable(),
    table.string("lastName").notNullable(),
    table.string("email").notNullable().unique().index("idx_employee_email");
    table.timestamps(true, true);    
  });

  //create department table
  await knex.schema.createTable("department", (table) => {
    table.increments("id").primary();
    table.integer("employee_id").unsigned().references("id").inTable("employee").onDelete("CASCADE");
    table.string("name").notNullable(),
    table.timestamps(true, true);
  });
}

// It is only called automatically by Knex when you explicitly trigger a rollback command
export async function down(knex: Promise<Knex>): Promise<void> {
  // If down is called
  const db = await knex;
  await db.schema.dropTableIfExists("orders");
  await db.schema.dropTableIfExists("customers");
  await db.schema.dropTableIfExists("department");
  await db.schema.dropTableIfExists("employee");
}