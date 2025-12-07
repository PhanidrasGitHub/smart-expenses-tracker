import Expense from "../models/Expense.js";
import mongoose from "mongoose";


// CRUP Operations for Expense

export const createExpense = async (req, res) => {
  try {
    const { amount, description, category, date,type } = req.body;
    const userId = req.user.id; // from JWT

    if (!amount || !description || !category || !type || !date) {
  return res.status(400).json({ message: "All fields are required" });
}


    const newExpense = new Expense({
      userId: userId,
      amount,
      description,
      category,
      type,
      date: new Date(date) // ensure it's stored as Date object
    });

    await newExpense.save();
    res.status(201).json(newExpense);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const getExpenses = async (req, res) => {
  try {
    const userId = req.user.id; // from JWT     
    const expenses = await Expense.find({ userId }).sort({ date: -1 });
    res.status(200).json(expenses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const getExpenseById = async (req, res) => {
    try {
        const userId = req.user.id; // from JWT
        const expenseId = req.params.id;

        const expense = await Expense.findOne({ _id: expenseId, userId });     

        if (!expense) {
            return res.status(404).json({ message: "Expense not found" });
        }       
        res.status(200).json(expense);      
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }   
};

export const deleteExpense = async (req, res) => {
    try {
        const userId = req.user.id; // from JWT
        const expenseId = req.params.id;    
        const expense = await Expense.findOneAndDelete({ _id: expenseId, userId });

        if (!expense) {
            return res.status(404).json({ message: "Expense not found" });
        }       

        res.status(200).json({ message: "Expense deleted successfully" });     
    }       
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }       

};

export const updateExpense = async (req, res) => {
    try {
        const userId = req.user.id; // from JWT
        const expenseId = req.params.id;
        const { amount, description, category, date,type } = req.body;  
        const expense = await Expense.findOne({ _id: expenseId, userId });

        if (!expense) {
            return res.status(404).json({ message: "Expense not found" });
        }       
        expense.amount = amount || expense.amount;
        expense.description = description || expense.description;
        expense.category = category || expense.category;
        expense.type = type || expense.type;
        expense.date = date ? new Date(date) : expense.date;
        await expense.save();
        res.status(200).json(expense);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};  

// CRUD Operations for Expense - End

export const searchExpenses = async (req, res) => {
  try {
    const { keyword } = req.query;
    //console.log("Searching expenses with keyword:", keyword);
    const expenses = await Expense.find({
      userId: req.user.id,
      $or: [
        { description: { $regex: keyword, $options: "i" } },
        { category: { $regex: keyword, $options: "i" } }
      ]
    }).sort({ date: -1 });

    res.status(200).json(expenses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};



export const filterExpenses = async (req, res) => {
  try {
    let { category, month, year } = req.query;

    //console.log("Filtering with:", { category, month, year });

    const filter = { userId: req.user.id };

    // Category filter (case-insensitive)
    if (category) {
      filter.category = new RegExp(`^${category}$`, "i");
    }

    // Month mapping for flexibility
    const monthMap = {
      jan: 1, january: 1,
      feb: 2, february: 2,
      mar: 3, march: 3,
      apr: 4, april: 4,
      may: 5,
      jun: 6, june: 6,
      jul: 7, july: 7,
      aug: 8, august: 8,
      sep: 9, sept: 9, september: 9,
      oct: 10, october: 10,
      nov: 11, november: 11,
      dec: 12, december: 12
    };

    if (month) {
      month = month.toLowerCase();

      // Convert month name → number
      if (isNaN(month)) {
        month = monthMap[month];
      } else {
        month = Number(month);
      }

      if (!month || month < 1 || month > 12) {
        return res.status(400).json({ message: "Invalid month value" });
      }

      if (!year) year = new Date().getFullYear();

      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 0, 23, 59, 59);

      filter.date = { $gte: start, $lte: end };
    }

    //console.log("Final Filter:", filter);

    const expenses = await Expense.find(filter).sort({ date: -1 });
    res.status(200).json(expenses);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};



export const sortExpenses = async (req, res) => {
  try {
    const { by } = req.query;
    const sortField = by === "amount" ? { amount: 1 } : { date: -1 }; // default date desc
    const expenses = await Expense.find({ userId: req.user.id }).sort(sortField);
    res.status(200).json(expenses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};


export const getSummary = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id); // <-- must use 'new'

    const summary = await Expense.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: "$type", // group by type (expense/income)
          totalAmount: { $sum: "$amount" }
        }
      }
    ]);

    res.status(200).json(summary);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const getStatistics = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const stats = await Expense.aggregate([
      { $match: { userId } },

      {
        $facet: {
          totalByType: [
            { 
              $group: { 
                _id: "$type", 
                totalAmount: { $sum: "$amount" } 
              } 
            }
          ],
          totalByCategory: [
            { 
              $group: { 
                _id: "$category", 
                totalAmount: { $sum: "$amount" } 
              } 
            }
          ],
          totalOverall: [
            { 
              $group: { 
                _id: null, 
                totalAmount: { $sum: "$amount" } 
              } 
            }
          ]
        }
      }
    ]);

    res.status(200).json(stats[0]); // stats[0] contains the facet result
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};


export const getUserExpenses = async (req, res) => {
  try {
    const { id } = req.params;
    const expenses = await Expense.find({ userId: id }).sort({ date: -1 });
    res.status(200).json(expenses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const deleteAllExpenses = async (req, res) => {
  try {
    await Expense.deleteMany({ userId: req.user.id });
    res.status(200).json({ message: "All expenses deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
