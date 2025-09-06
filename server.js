//----------Setup---------------
import express from "express";
import cors from 'cors';
import "dotenv/config.js";
import helmet from "helmet";
import morgan from "morgan";

const app = express();

//-----------Middleware-------------
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({extended: true}));


//--------------API_ROUTES------------------
import authRoutes from './src/routes/authRoutes.js'
import bankRoutes from './src/routes/bankRoutes.js'
import transactionRoutes from './src/routes/transactionRoutes.js'
//------routes-------------
app.use('/api/auth', authRoutes);
app.use('/api/bank', bankRoutes);
app.use('/api/transaction', transactionRoutes)

//--------Check_Routes--------
app.get('/check',(req,res)=>{
    res.json({message: 'UPI backend running..!!'})
})

app.use((err, req, res, next)=>{
    console.error(err.stack);
    res.status(500).json({message: 'Internal Server Error..!!!'})
})

const PORT = process.env.PORT || 4000;
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})