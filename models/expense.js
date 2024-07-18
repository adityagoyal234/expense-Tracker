import { getDb } from '../util/database.js';
import mongoDb from 'mongodb';
import { Budget } from './budget.js';

class Expense {
    constructor(expenseName, amount, budgetCategory, date, id) {
        this.expenseName = expenseName;
        this.amount = amount;
        this.budgetCategory = budgetCategory;
        this.date = date;
        this._id = id ? mongoDb.ObjectId.createFromHexString(id) : null;
    }

    async save() {
        try {
            const db = getDb();
            await db.collection('expense').insertOne(this);
            const budget = await Budget.findByName(this.budgetCategory);
            await budget.includeExpense(this.amount);
            console.log(`the budget Category is ${budget.name}`);
            const result = await db.collection('expense').find(this).toArray();
            console.log(`expense has been created from the models section having name as ${this.expenseName} and its cost is  ${this.amount}`);
            return result;
        } catch (error) {
            throw new Error(error);
        }
    }

    static async isPresent() {
        try {
            const db = getDb();
            const count = await db.collection('budget').estimatedDocumentCount();
            return count > 0;
        } catch (error) {
            throw new Error(error);
        }
    }

    static async fetchAllBudgets() {
        try {
            const db = getDb();
            const budgets = await db.collection('budget').find({}).toArray();
            console.log(`fetched all budgets in the models folder`);
            return budgets;
        } catch (error) {
            throw new Error(error);
        }
    }

    static async fetchAllExpenses() {
        try {
            const db = getDb();
            const expenses = await db.collection('expense').find({}).toArray();
            expenses.sort(function (a, b) {
                return b.date - a.date;
            });
            console.log(`all expenses fetched and sorted`);
            return expenses;
        } catch (error) {
            throw new Error(error);
        }
    }

    static async fetchExpensesByBudget(budget) {
        try {
            const db = getDb();
            const expenses = await db.collection('expense').find({ budgetCategory: budget.name }).toArray();
            for (let expense of expenses) {
                console.log(`the expense name is ${expense.expenseName}`);
            }
            return expenses;
        } catch (error) {
            throw new Error(error);
        }
    }

    static async deleteExpensesByBudgetCategory(budget) {
        try {
            const db = getDb();
            await db.collection('expense').deleteMany({ budgetCategory: budget.name });
            console.log(`all the expenses of the budget ${budget.name} have been deleted`);
        } catch (error) {
            throw new Error(error);
        }
    }

    static async deleteExpense(expenseId) {
        try {
            const db = getDb();
            await db.collection('expense').deleteOne({ _id: mongoDb.ObjectId.createFromHexString(expenseId) });
            console.log(`the expense having id ${expenseId} has been deleted`);
        } catch (error) {
            throw new Error(error);
        }
    }
}

export { Expense };