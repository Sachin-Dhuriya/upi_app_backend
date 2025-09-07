import bcrypt from "bcryptjs";
export async function seed(knex) {
  await knex("users").del();

  let pass1 = await bcrypt.hash("Alice@123",10)
  let pass2 = await bcrypt.hash("Bob@123",10)
  let pass3 = await bcrypt.hash("Charlie@123",10)

  await knex("users").insert([
    { id: 1, name: "Alice", email: "alice@example.com", password_hash: pass1, upi_id: "alice@upi" },
    { id: 2, name: "Bob", email: "bob@example.com", password_hash: pass2, upi_id: "bob@upi" },
    { id: 3, name: "Charlie", email: "charlie@example.com", password_hash: pass3, upi_id: "charlie@upi" }
  ]);
}
