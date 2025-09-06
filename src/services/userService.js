import db from '../../config/db.js'

export async function getUserByEmail(email) {
    return db("users").where({ email }).first();
}

export async function createUser({name, email, password_hash, upi_id}) {
    const [user] = await db("users")
        .insert({ name, email, password_hash, upi_id })
        .returning(["name", "email", "upi_id"]);
    return user;
}   

export async function getUserById(id) {
    return await db("users").where({id}).first();
}