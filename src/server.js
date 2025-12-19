import express from 'express';
import dotenv from 'dotenv';
import {initDB} from './config/db.js';
import rateLimiter from './middleware/rateLimiter.js';
import transactionRoutes from './router/transactionRoutes.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(rateLimiter);
app.use(express.json());

app.use('/api/transactions',transactionRoutes);
app.get('/health', (req, res) => {
  res.send('Expense Tracker API is running');
});


initDB().then(()=>{
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});


