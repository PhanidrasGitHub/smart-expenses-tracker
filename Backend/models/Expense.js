import mongoose  from "mongoose";

const expenseSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
     type: { type: String, enum: ['income', 'expense'], required: true },
    date: { type: Date, required: true }
}, { timestamps: true });
const Expense = mongoose.model("Expense", expenseSchema);

export default Expense;