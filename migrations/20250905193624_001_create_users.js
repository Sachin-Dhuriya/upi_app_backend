
export async function up(knex) {
    await knex.schema.createTable("users", (table) => {
        table.increments("id").primary();
        table.string("name").notNullable();
        table.string("email").notNullable().unique();
        table.string("password_hash").notNullable();
        table.string("upi_id").unique();
        table.timestamps(true, true);

        table.index("email", "idx_users_email");   // Faster lookups for login
        table.index("upi_id", "idx_users_upi_id");
    });
};

export async function down(knex) {
    await knex.schema.dropTableIfExists("users")
};
