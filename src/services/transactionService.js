import db from "../../config/db.js";
import { ApiError } from "../utils/ApiError.js"

export async function createTransactionRequest(from_user_id, { to_user_id, amount }) {
    const [request] = await db("transaction_requests").insert({ from_user_id, to_user_id, amount })
        .returning("*")

    return request;
}

export async function getAllTransactionRequest(user_id) {
    return await db("transaction_requests").where({ to_user_id: user_id }).returning("*")
}

export async function getAllSendTransaction(user_id) {
    return await db("transaction_requests").where({ from_user_id: user_id }).returning("*")
}

export async function respondToTransactionRequest(user_id, { request_id, action }) {
    return await db.transaction(async (trx) => {
        const request = await trx("transaction_requests").where({ id: request_id }).first().forUpdate()
        if (!request) throw new ApiError(400, "Request not found")

        if (request.to_user_id !== user_id) throw new ApiError(400, "Not authorize to respond to this request..!!!")

        if (request.status !== "Pending") throw new ApiError(400, "Request already processed..!!!")

        if (action === "Rejected") {
            await trx("transaction_requests").where({ id: request_id }).update({ status: "Rejected", updated_at: trx.fn.now() })
            return { ...request, status: "Rejected" }
        }

        const fromAccount = await trx("bank_accounts").where({ user_id: request.from_user_id }).first().forUpdate();
        const toAccount = await trx("bank_accounts").where({ user_id: request.to_user_id }).first().forUpdate();
        if (!fromAccount || !toAccount) throw new Error("Bank account not found of sender or receiver..!!!")

        const amount = parseFloat(request.amount);
        const payerBalance = parseFloat(toAccount.balance);

        if (Number.isNaN(amount) || Number.isNaN(payerBalance)) {
            throw new Error("Invalid balance or amount value..!!!");
        }

        if (payerBalance < amount) {
            throw new ApiError(400, "Insufficient Balance..!!!");
        }

        await trx("bank_accounts").where({ id: toAccount.id }).decrement("balance", request.amount)
        await trx("bank_accounts").where({ id: fromAccount.id }).increment("balance", request.amount)

        await trx("transaction_requests").where({ id: request_id }).update({ status: "Accepted", updated_at: trx.fn.now() })

        const [transaction] = await trx("transactions").insert({ from_user_id: request.to_user_id, from_account_id: toAccount.id, to_user_id: request.from_user_id, to_account_id: fromAccount.id, amount: request.amount, status: "Success" })
            .returning("*")

        return transaction
    })
}

export async function getTransactionHistory(userId, { status, from, to, page = 1, limit = 10 }) {
    let query = db("transactions")
        .where((qb) => {
            qb.where("from_user_id", userId).orWhere("to_user_id", userId);
        })
        .select(
            "id",
            "from_user_id",
            "to_user_id",
            "amount",
            "status",
            "created_at"
        )
        .orderBy("created_at", "desc");

    if (status) {
        query = query.andWhere("status", status);
    }

    if (from && to) {
        query = query.andWhereBetween("created_at", [from, to]);
    } else if (from) {
        query = query.andWhere("created_at", ">=", from);
    } else if (to) {
        query = query.andWhere("created_at", "<=", to);
    }

    const offset = (page - 1) * limit;
    query = query.limit(limit).offset(offset);

    const [{ count }] = await db("transactions")
        .where((qb) => {
            qb.where("from_user_id", userId).orWhere("to_user_id", userId);
        })
        .count("* as count");

    const data = await query;
    return { data, pagination: { page, limit, total: Number(count) } };
}

export async function getTransactionById(userId, transactionId) {
  const transaction = await db("transactions")
    .where({ id: transactionId })
    .andWhere((qb) => {
      qb.where("from_user_id", userId).orWhere("to_user_id", userId);
    })
    .first();

  if (!transaction) {
    throw new ApiError(404, "Transaction not found or not accessible");
  }

  return transaction;
}
