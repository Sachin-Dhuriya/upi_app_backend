export async function seed(knex) {
  await knex("bank_accounts").del();

  await knex("bank_accounts").insert([
    { id: 1, user_id: 1, account_number: "111111111", ifsc_code: "BANK001", balance: 50000.00 },
    { id: 2, user_id: 2, account_number: "222222222", ifsc_code: "BANK002", balance: 30000.00 },
    { id: 3, user_id: 3, account_number: "333333333", ifsc_code: "BANK003", balance: 15000.00 }
  ]);
}
