import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Clear tables in reverse dependency order to avoid foreign key violations
  await knex("orders").del();
  await knex("users").del();

  // Insert baseline parent record and capture the generated ID
  const [insertedUser] = await knex("users")
    .insert({ email: "architect@example.com" })
    .returning("id");

  const userId = typeof insertedUser === "object" ? insertedUser.id : insertedUser;

  // Insert relational child records tied to the parent
  await knex("orders").insert([
    { user_id: userId, total_amount: 150.00, status: "COMPLETED" },
    { user_id: userId, total_amount: 75.50, status: "PENDING" },
  ]);
}