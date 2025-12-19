import express from 'express';
import dotenv from 'dotenv';
import {initDB} from './config/db.js';
import rateLimiter from './middleware/rateLimiter.js';
import transactionRoutes from './router/transactionRoutes.js';
import job from './config/cron.js'
dotenv.config();

const app = express();

if (process.env.NODE_ENV === "production") job.start();
const PORT = process.env.PORT || 5000;
app.use(rateLimiter);
app.use(express.json());

app.use('/api/transactions',transactionRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({status:'ok'})
});

initDB().then(()=>{
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});


