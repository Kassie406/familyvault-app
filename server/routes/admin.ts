import express from 'express';
import { getBudgetStatus } from '../services/budgetGuard';
const admin = express.Router();

admin.get('/usage', (_req, res) => {
  res.json({ ok: true, budget: getBudgetStatus() });
});

export default admin;