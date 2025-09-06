import validator from '../utils/validators.js'
import { checkExistingAccount, linkBankAccount, getAccountBalanceByUserId} from '../services/bankService.js'

const addBankAccount = async (req, res, next) => {
    try {
        if (!req.body) return res.status(400).json({ message: "Form body required..!!!" })

        let { error } = validator.bankAccountLinkValidator.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message })

        let { account_number, ifsc_code, balance } = req.body;

        let alreadyAddedAccount = await checkExistingAccount(account_number)
        if (alreadyAddedAccount) return res.status(400).json({ message: 'Bank account already added' })

        const account = await linkBankAccount(req.user.id, { account_number, ifsc_code, balance })

        res.status(201).json({ message: 'Bank account linked successfully..!!!', account })
    } catch (err) {
        next(err)
    }
}

const getAccountBalance = async(req, res, next) => {
    try {
        let userId = req.user.id;

        const account = await getAccountBalanceByUserId(userId)
        if(account.length === 0) return res.status(400).json({message: "Link bank account first..!!!"})

        res.status(200).json({ message: 'Your Account Balance', account })
    } catch (err) {
        next(err)
    }
}


export default {
    addBankAccount, getAccountBalance
}