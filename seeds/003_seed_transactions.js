export async function seed(knex) {
  await knex("transactions").del();

  await knex("transactions").insert([
    {
      id: 1,
      from_user_id: 1,
      from_account_id: 1,
      to_user_id: 2,
      to_account_id: 2,
      amount: 1000.00,
      status: "Success"
    },
    {
      id: 2,
      from_user_id: 2,
      from_account_id: 2,
      to_user_id: 3,
      to_account_id: 3,
      amount: 2000.00,
      status: "Success"
    }
  ]);
}
