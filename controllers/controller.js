import { Budget } from "../models/budget.js";
import { Expense } from "../models/expense.js";

const getFullBudget = async (req, res, next) => {
    try {
        // const db = getDb();
        const budgets = await Budget.fetchAllBudgets();
        const expenses = await Expense.fetchAllExpenses();
        res.render('index', {
            title: 'My Express App',
            message: 'Welcome to My Express App',
            budgets: budgets,
            expenses: expenses
        });
    } catch (error) {
        next(error);
    }
};

const postCreateNewBudget = async (req, res, next) => {
    try {
        const budgetName = req.body.budgetName;
        const amount = req.body.amount;
        const budget = new Budget(budgetName, amount, amount);
        const result = await budget.save();
        console.log(`New budget has been added : ${result}`);
        console.log(`the budget for ${budgetName} is ${amount}`);
        res.redirect('/');
    } catch (error) {
        next(error);
    }
}

const getViewBudget = async (req, res, next) => {
    try {
        const budgetId = req.params.budgetId;
        console.log(budgetId);
        const budget = await Budget.fetchBudgetById(budgetId);
        const expenses = await Expense.fetchExpensesByBudget(budget);
        res.render('budgetView', {
            title: 'My Express App',
            message: 'Welcome to My Express App',
            budget: budget,
            expenses: expenses
        });
    } catch (error) {
        next(error);
    }
}

const postAddExpense = async (req, res, next) => {
    try {
        const { expenseName, amount, budgetCategory } = req.body;
        const date = new Date();
        const expense = new Expense(expenseName, amount, budgetCategory, date);
        const savedExpense = await expense.save();
        console.log(`the expense ${savedExpense.amount} has been saved`);
        if (req.params.budgetId) {
            res.redirect(`/viewBudget/${req.params.budgetId}`);
        }
        else {
            res.redirect('/');
        }
    } catch (error) {
        next(error);
    }
}

const postDeleteBudget = async (req, res, next) => {
    try {
        const budgetId = req.body.budgetId;
        const budget = await Budget.fetchBudgetById(budgetId);
        await Expense.deleteExpensesByBudgetCategory(budget);
        await Budget.deleteBudgetById(budgetId);
        res.redirect('/');
    } catch (error) {
        next(error);
    }
}

const postDeleteExpense = async (req, res, next) => {
    try {
        const expenseAmount = req.body.expenseAmount;
        const expenseBudgetCategory = req.body.expenseBudgetCategory;
        const expenseId = req.body.expenseId;
        console.log(`${expenseAmount}   ${expenseBudgetCategory}  ${expenseId}`);
        await Budget.increaseRemainingAmount(expenseAmount, expenseBudgetCategory);
        await Expense.deleteExpense(expenseId);
        if (req.params.budgetId) {
            res.redirect(`/viewBudget/${req.params.budgetId}`);
        }
        else {
            res.redirect('/');
        }
    } catch (error) {
        next(error);
    }
}

export { getFullBudget, postCreateNewBudget, getViewBudget, postAddExpense, postDeleteBudget, postDeleteExpense };