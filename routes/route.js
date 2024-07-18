import express from 'express';
import * as controller from '../controllers/controller.js';

const router = express.Router();

router.get('/', controller.getFullBudget);

router.post('/create-budget', controller.postCreateNewBudget);

router.get('/viewBudget/:budgetId', controller.getViewBudget);

router.post('/add-expense', controller.postAddExpense);

router.post('/add-expense/:budgetId', controller.postAddExpense);

router.post('/deleteBudget', controller.postDeleteBudget);

router.post('/deleteExpense', controller.postDeleteExpense);

router.post('/deleteExpense/:budgetId', controller.postDeleteExpense);

export { router };