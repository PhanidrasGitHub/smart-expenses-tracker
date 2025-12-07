import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import {
  getExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
  searchExpenses,
  filterExpenses,
  sortExpenses,
  getSummary,
  getStatistics,
  getUserExpenses,
  deleteAllExpenses
} from '../controllers/expenseController.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getExpenses);
router.post('/', createExpense);
router.put('/:id', updateExpense);
router.delete('/:id', deleteExpense);

router.get('/search', searchExpenses);
router.get('/filter', filterExpenses);
router.get('/sort', sortExpenses);
router.get('/summary', getSummary);
router.get('/statistics', getStatistics);
router.get('/user/:id', getUserExpenses);
router.delete('/', deleteAllExpenses);
router.get('/:id', getExpenseById);

export default router;