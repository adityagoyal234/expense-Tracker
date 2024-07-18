import { getDb } from '../util/database.js';
import mongoDb from 'mongodb';


class Budget {
    constructor(name, initialAmount, remainingAmount, id) {
        this.name = name;
        this.initialAmount = Number(initialAmount);
        this.remainingAmount = Number(remainingAmount);
        this._id = id ? id : null;
    }

    async save() {
        try {
            const db = getDb();
            await db.collection('budget').insertOne(this);
            const result = await db.collection('budget').find(this).toArray();
            console.log(`budget has been created from the models section having name as ${this.name} and the total budget as ${this.amount}`);
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

    static async fetchBudgetById(budgetId) {
        try {
            const db = getDb();
            const budgetCursor = db.collection('budget').find({ _id: mongoDb.ObjectId.createFromHexString(budgetId) });
            const budget = await budgetCursor.next();
            console.log(`sucessfully fetched budget ${budget.name} having budgetId ${budgetId}`);
            return budget;
        } catch (error) {
            throw new Error(error);
        }
    }

    static async findByName(name) {
        try {
            const db = getDb();
            const budget = await db.collection('budget').findOne({ name: name });
            if (budget) {
                return new Budget(budget.name, budget.initialAmount, budget.remainingAmount, budget._id);
            }
            console.log(`budget not found for this particular expense`);
            return null;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async includeExpense(amount) {
        try {
            const db = getDb();
            amount = Number(amount);
            await db.collection('budget').updateOne(
                { _id: this._id },
                { $set: { remainingAmount: this.remainingAmount - amount } }
            );
            console.log(`the updated balance for ${this.name} is ${this.remainingAmount - amount}`);
        } catch (error) {
            throw new Error(error);
        }
    }

    static async deleteBudgetById(budgetId) {
        try {
            const db = getDb();
            await db.collection('budget').deleteOne({ _id: mongoDb.ObjectId.createFromHexString(budgetId) });
            console.log(`budget with id ${budgetId} sucessfully deleted`);
        } catch (error) {
            throw new Error(error);
        }
    }

    static async increaseRemainingAmount(expenseAmount, expenseBudgetCategory) {
        try {
            const db = getDb();
            //console.log(`${this.remainingAmount}`);
            const budget = await db.collection('budget').findOne({ name: expenseBudgetCategory });
            await db.collection('budget').updateOne(
                { name: expenseBudgetCategory },
                {
                    $set: {
                        remainingAmount: Number(budget.remainingAmount) + Number(expenseAmount)
                    }
                });
            //console.log(`${expenseAmount}`);
            console.log(`budget ${expenseBudgetCategory}'s remaining amount sucessfully updated`);
        } catch (error) {
            throw new Error(error);
        }
    }
}

export { Budget };