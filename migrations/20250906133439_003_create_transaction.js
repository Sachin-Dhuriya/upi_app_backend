
export async function up(knex) {
    await knex.schema.createTable("transactions", (table)=>{
        table.increments("id").primary();

        table.integer("from_user_id").unsigned().references("id").inTable("users").onDelete("CASCADE").index();
        table.integer("from_account_id").unsigned().references("id").inTable("bank_accounts").onDelete("CASCADE")

        table.integer("to_user_id").unsigned().references("id").inTable("users").onDelete("CASCADE").index();
        table.integer("to_account_id").unsigned().references("id").inTable("bank_accounts").onDelete("CASCADE")

        table.decimal("amount",15,2).notNullable();
        table.enu("status", ["Pending", "Success", "Failed"]).defaultTo("Pending").index();

        table.timestamps(true, true)

        table.index(["from_user_id","created_at"], "idx_txn_from_user")
        table.index(["to_user_id", "created_at"], "idx_txn_to_user")

    })

};

export async function down(knex) {
    await knex.schema.dropTableIfExists("transaction")
};
