import {sql} from "../config/db.js";

const createTransaction = async (req, res) => {
  try{
    const { user_id, amount, category, title } = req.body;
    if (!user_id || !amount || !category || !title) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const transaction = await sql`
    INSERT INTO transaction (user_id, amount, category, title)
    VALUES (${user_id}, ${amount}, ${category}, ${title})
    RETURNING *`;
    console.log('Transaction created:', transaction);
    res.status(201).json(transaction[0]); 
  }catch(err){
    console.error('Error creating transaction', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
const getTransactionsByUser = async (req, res) => {
  try{
    const {userId} = req.params;
    console.log('Fetching transactions for user:', userId);
    const transactions = await sql`SELECT * FROM transaction WHERE user_id = ${userId} ORDER BY created_at DESC`;
    res.status(200).json(transactions);
  }catch(err){
    console.error('Error fetching transactions', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
const deleteTransaction = async (req, res) => {
  try{
    const {id} = req.params;
    if(isNaN(parseInt(id))){
      return res.status(400).json({ error: 'Invalid transaction ID' });
    }
    const result = await sql`DELETE FROM transaction WHERE id = ${id} RETURNING *`;
    if (result.length === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.status(200).json({message:'Transaction deleted successfully'});
  }catch(err){
    console.error('Error deleting transaction', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
const getTransactionSummary = async (req,res)=>{
  try{
    const {userId} = req.params;

    const balanceResult = await sql`SELECT COALESCE(SUM(amount),0) AS balance FROM transaction WHERE user_id = ${userId}`;
    const incomeResult = await sql`SELECT COALESCE(SUM(amount),0) AS income FROM transaction WHERE user_id = ${userId} AND amount > 0`;
    const expenseResult = await sql`SELECT COALESCE(SUM(amount),0) AS expense FROM transaction WHERE user_id = ${userId} AND amount < 0`;
     
    res.status(200).json({
      balance: balanceResult[0].balance,
      income: incomeResult[0].income,
      expense: expenseResult[0].expense
    });
  }catch(err){
    console.error('Error fetching summary', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
export {createTransaction, getTransactionsByUser, deleteTransaction, getTransactionSummary};