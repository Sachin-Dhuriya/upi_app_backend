import jwt from 'jsonwebtoken';

const authenticate = (req, res, next) => {
    let token = req.headers.authorization?.split(' ')[1];
    if(!token) return res.status(401).json({message: 'Please login first..!!!'})
    
    let decoded = jwt.verify(token, process.env.JWT_SECRET)
    
    req.user = decoded;
    next();
}

export default authenticate;