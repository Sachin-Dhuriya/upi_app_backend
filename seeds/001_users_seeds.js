import bcrypt from "bcryptjs";

export async function seed(knex) {
  await knex("users").del();

  const password1 = await bcrypt.hash("user1@123", 10);
  const password2 = await bcrypt.hash("user2@123", 10);
  const password3 = await bcrypt.hash("user3@123", 10);

  await knex("users").insert([
    {
      name: "User1",
      email: "user1@gmail.com",
      password_hash: password1,
      upi_id: "user1@upi"
    },
    {
      name: "User2",
      email: "user2@gmail.com",
      password_hash: password2,
      upi_id: "user2@upi"
    },
    {
      name: "User3",
      email: "user3@gmail.com",
      password_hash: password3,
      upi_id: "user3@upi"
    }
  ]);
}
