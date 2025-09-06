import validator from '../utils/validators.js'
import { getUserByEmail, createUser, getUserById } from '../services/userService.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'

const userRegister = async (req, res, next) => {
    try {
        if (!req.body) return res.status(400).json({ message: "Form data required" });

        let { error } = validator.userValidator.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message })

        let { name, email, password } = req.body;
        let existingUser = await getUserByEmail(email);
        if (existingUser) return res.status(400).json({ message: 'User email already logged in please login..!!!' })

        const password_hash = await bcrypt.hash(password, 10)

        let upi_id = `${email.split("@")[0]}@upi`

        const user = await createUser({ name, email, password_hash, upi_id })

        res.status(201).json({ message: 'User registered successfully', user })
    } catch (err) {
        next(err);
    }
}

const userLogin = async (req, res, next) => {
    try {
        let { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: "Email and Password required...!!!" })

        let existingUser = await getUserByEmail(email)
        if (!existingUser) return res.status(400).json({ message: 'Please signup before login..!!!' })

        let checkPass = await bcrypt.compare(password, existingUser.password_hash)
        if (!checkPass) return res.status(401).json({ message: "Invalid Credential..!!!" })

        let token = jwt.sign(
            { id: existingUser.id, email: existingUser.email, upi: existingUser.upi_id },
            process.env.JWT_SECRET,
            { expiresIn: "12h" },
        )

        res.status(200).json({ message: 'User Login Successfull..!!!', name: existingUser.name, token })
    } catch (err) {
        next(err);
    }
}

const userProfile = async (req, res, next) => {
    try {
        let id = req.user.id;

        let user = await getUserById(id)
        if (!user) return res.status(404).json({ message: 'User not found..!!!' })

        res.status(200).json({ message: `Welcome ${user.name}`, data: req.user })
    } catch (err) {
        next(err);
    }
}


export default { userLogin, userRegister, userProfile }