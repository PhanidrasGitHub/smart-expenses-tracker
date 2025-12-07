import { useContext, useState, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import Stats from "../components/Stats";
import Spinner from "../components/Spinner";

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState(""); // income/expense
  const [date, setDate] = useState("");
  const [expenses, setExpenses] = useState(null); // holds API data
  const [loading,setLoading] = useState(true)

  const token = localStorage.getItem("token");

  // Fetch expenses on mount
  useEffect(() => {
    if (user) fetchExpenses();
  }, [user]);

  const fetchExpenses = async () => {
    try {
      const res = await axios.get("https://smart-expenses-tracker.onrender.com/api/expenses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExpenses(res.data);
      
    } catch (err) {
      console.error("Error fetching expenses:", err.response?.data || err);
      setExpenses([]);
    }
    setLoading(false)
  };

  const handleSubmit = async (e) => {
    
    e.preventDefault();
    if (!amount || !description || !category || !type || !date) return;

    try {
      const payload = { amount: Number(amount), description, category, type, date };
      await axios.post("https://smart-expenses-tracker.onrender.com/api/expenses", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Reset form
      setAmount("");
      setDescription("");
      setCategory("");
      setType("");
      setDate("");

      // Refresh stats after adding
      fetchExpenses();
      
    } catch (err) {
      console.error("Error adding expense:", err.response?.data || err);
    }
   
  };

  if (!user) {
    return (
      <div className="p-6 min-h-screen flex flex-col justify-center items-center bg-gray-100 text-center pt-16">
        <h1 className="text-3xl font-bold mb-4">Welcome to Smart Expenses Tracker</h1>
        <p className="text-gray-700 max-w-md">
          Track your income and expenses, visualize spending patterns, and manage your finances easily. 
          Please login or signup to access the full dashboard.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-gray-100 flex flex-col lg:flex-row gap-6 pt-20">
      {/* Left: Stats */}
      <div className="lg:w-2/3 bg-white shadow-lg rounded-xl p-6">
        {loading ? (
            
          <Spinner/>
          
        ) : (
          <Stats expenses={expenses} />
        )}
      </div>

      {/* Right: Expense Form */}
      <form
        onSubmit={handleSubmit}
        className="lg:w-1/3 bg-white shadow-lg rounded-xl p-6 space-y-4"
      >
        <h2 className="text-xl font-semibold mb-4">Add Expense</h2>

        <select
          className="w-full p-2 border rounded"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="">Select Type</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <input
          placeholder="Amount"
          type="number"
          className="w-full p-2 border rounded"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <input
          placeholder="Category"
          type="text"
          className="w-full p-2 border rounded"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <input
          placeholder="Description"
          type="text"
          className="w-full p-2 border rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          type="date"
          className="w-full p-2 border rounded"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          Add Expense
        </button>
      </form>
    </div>
  );
};

export default Dashboard;
