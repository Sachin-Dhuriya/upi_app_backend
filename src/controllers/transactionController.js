import validators from "../utils/validators.js"
import { getAccountBalanceByUserId, getAccountById } from "../services/bankService.js";
import { getUserByUpiId } from "../services/userService.js"
import { createTransactionRequest, getAllTransactionRequest, getAllSendTransaction, respondToTransactionRequest, getTransactionHistory, getTransactionById  } from "../services/transactionService.js"
import db from "../../config/db.js";

const sendMoney = async (req, res, next) => {
    try {
        let { fromAccountId, to_upi_id, amount } = req.body;
        if (!fromAccountId || !to_upi_id || !amount) return res.status(400).json({ message: "All fields required..!!!" })

        let { error } = validators.sendMoneyValidator.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message })

        let senderAccount = await getAccountById(fromAccountId, req.user.id)
        if (!senderAccount) return res.status(400).json({ message: "Sender account not found" })
        console.log(amount, senderAccount.balance);
        if (Number(amount) > Number(senderAccount.balance)) return res.status(400).json({ message: 'Insufficient Funds to transfer..!!!' })

        let receiver = await getUserByUpiId(to_upi_id)
        console.log(receiver);
        if (!receiver) return res.status(400).json({ message: "This UPI id does not belong to any user..!!!" })

        if (receiver.id === req.user.id) return res.status(400).json({ message: "You cannot send money to yourself..!!!" })

        let receiverAccounts = await getAccountBalanceByUserId(receiver.id);
        if (receiverAccounts.length === 0) return res.status(400).json({ message: "Receiver does not have any bank account linked" })

        const receiverAccount = await db("bank_accounts")
            .where({ user_id: receiver.id })
            .first();

        const transaction = await db.transaction(async (trx) => {
            await trx("bank_accounts").where({ id: senderAccount.id }).decrement("balance", amount);

            await trx("bank_accounts").where({ id: receiverAccount.id }).increment("balance", amount);

            const [txn] = await trx("transactions")
                .insert({
                    from_user_id: req.user.id,
                    from_account_id: senderAccount.id,
                    to_user_id: receiver.id,
                    to_account_id: receiverAccount.id,
                    amount,
                    status: "Success",
                })
                .returning("*");

            return txn;
        });


        res.status(200).json({ message: "Transaction Successfull", transaction })
    } catch (err) {
        next(err)
    }
}

const requestMoney = async (req, res, next) => {
    try {
        let { to_user_id, amount } = req.body;
        if (!to_user_id || !amount) return res.status(400).json({ message: "Receiver user id and amount both required" })

        let { error } = validators.requestMoneyValidator.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message })

        if (to_user_id === req.user.id) return res.status(400).json({ message: "You cannot request money from yourself..!!!" })

        const request = await createTransactionRequest(req.user.id, { to_user_id, amount })

        res.status(200).json({ message: "Transaction request created..!!!!", request })
    } catch (err) {
        next(err)
    }
}

const listOfRequestReceived = async (req, res, next) => {
    try {
        let allRequest = await getAllTransactionRequest(req.user.id)
        if (allRequest.length === 0) return res.status(400).json({ message: "No request transaction..!!!" })

        res.status(200).json({ message: "Transaction request list..!!!", allRequest })
    } catch (err) {
        next(err)
    }
}

const listOfRequestSend = async (req, res, next) => {
    try {
        let allRequest = await getAllSendTransaction(req.user.id)
        if (allRequest.length === 0) return res.status(400).json({ message: "No sent transaction..!!!" })

        res.status(200).json({ message: "Transaction request sent list..!!!", allRequest })
    } catch (err) {
        next(err)
    }
}

const respondTransactionRequest = async (req, res, next) => {
    try {
        let { request_id, action } = req.body;
        if (!request_id || !action) return res.status(400).json({ message: "Request_Id and Action Required..!!!" })

        let { error } = validators.respondRequestValidator.validate(req.body)
        if (error) return res.status(400).json({ message: error.details[0].message })

        let result = await respondToTransactionRequest(req.user.id, { request_id, action })

        res.status(200).json({
            message: `Request ${action.toLowerCase()} successfully`,
            result
        })
    } catch (err) {
        next(err)
    }
}

export async function transactionHistory(req, res, next) {
  try {
    const { status, from, to, page, limit } = req.query;
    const history = await getTransactionHistory(req.user.id, {
      status,
      from,
      to,
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
    });

    res.status(200).json(history);
  } catch (err) {
    next(err);
  }
}

export async function getTransactionStatus(req, res, next) {
  try {
    const transactionId = parseInt(req.params.id, 10);
    if (isNaN(transactionId)) res.status(400).json({message: "Invalid Transaction Id..!!!"})

    const transaction = await getTransactionById(req.user.id, transactionId);

    res.status(200).json({message: "Transaction fetched successfully",transaction,});
  } catch (err) {
    next(err);
  }
}

export default { 
    sendMoney, requestMoney, listOfRequestReceived, listOfRequestSend, respondTransactionRequest, transactionHistory, getTransactionStatus
}