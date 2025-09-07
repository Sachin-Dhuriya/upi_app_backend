
export async function up(knex) {
    await knex.schema.createTable("transaction_requests", (table)=>{
        table.increments("id").primary();

        table.integer("from_user_id").unsigned().references("id").inTable("users").onDelete("CASCADE").index();
        table.integer("to_user_id").unsigned().references("id").inTable("users").onDelete("CASCADE").index();

        table.decimal("amount",15,2).notNullable();

        table.enu("status", ["Pending", "Accepted", "Rejected"]).defaultTo("Pending").index();

        table.timestamps(true, true)
        
        table.index(["from_user_id", "to_user_id"], "idx_request_users")
    })


};

export async function down(knex) {
  await knex.schema.dropTableIfExists("transaction_requests")
};
