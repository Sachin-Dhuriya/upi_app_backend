
export async function up(knex) {
  await knex.schema.alterTable("users", (table) => {
    table.index("email", "idx_users_email");   
    table.index("upi_id", "idx_users_upi_id"); 
  });
}

export async function down(knex) {
  await knex.schema.alterTable("users", (table) => {
    table.dropIndex("email", "idx_users_email");
    table.dropIndex("upi_id", "idx_users_upi_id");
  });
}
