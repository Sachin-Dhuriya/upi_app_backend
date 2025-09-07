export async function seed(knex) {
  await knex("transaction_requests").del();

  await knex("transaction_requests").insert([
    {
      id: 1,
      from_user_id: 1,   // Alice requests from Bob
      to_user_id: 2,
      amount: 500.00,
      status: "Pending"
    },
    {
      id: 2,
      from_user_id: 3,   // Charlie requests from Alice
      to_user_id: 1,
      amount: 750.00,
      status: "Accepted"
    }
  ]);
}
