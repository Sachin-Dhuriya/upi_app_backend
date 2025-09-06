
export async function up(knex) {
  await knex.schema.createTable("bank_accounts",(table)=>{
    table.increments("id").primary();
    table.integer("user_id").unsigned().references("id").inTable("users").onDelete("CASCADE").index();
    table.string("account_number").notNullable().unique();
    table.string("ifsc_code").notNullable();
    table.decimal("balance",15,2).notNullable().default(0.00);
    table.timestamps(true, true);

    table.index(["account_number", "ifsc_code"],"idx_account_ifsc")

  })
};

export async function down(knex) {
    await knex.schema.table("bank_accounts",(table)=>{
        table.dropIndex(["user_id"]);
        table.dropIndex(["account_number", "ifsc_code"], "idx_account_ifsc")
    })

    await knex.schema.dropTableIfExists("bank_accounts")

};
