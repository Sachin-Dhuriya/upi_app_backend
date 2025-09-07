import db from '../../config/db.js'

export async function checkExistingAccount(account_number) {
    return await db("bank_accounts").where({ account_number }).first();
}

export async function linkBankAccount(user_id, { account_number, ifsc_code, balance = 0 }) {
    let [account] = await db("bank_accounts").insert({ user_id, account_number, ifsc_code, balance })
        .returning(["account_number", "ifsc_code", "balance"])
    return account;
}

export async function getAccountBalanceByUserId(userId) {
    return await db("bank_accounts").where({user_id: userId}).select("id","account_number", "ifsc_code", "balance")
}

export async function getAccountById(accountId, userId) {
  return db("bank_accounts")
    .where({ id: accountId, user_id: userId })
    .first();
}
