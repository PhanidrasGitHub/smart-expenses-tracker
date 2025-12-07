import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditExpense = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [expense, setExpense] = useState({
    amount: "",
    description: "",
    category: "",
    type: "",
    date: "",
  });

  const [loading, setLoading] = useState(true);

  // Fetch current expense
  useEffect(() => {
    const fetchExpense = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/expenses/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setExpense({
          amount: res.data.amount,
          description: res.data.description,
          category: res.data.category,
          type: res.data.type,
          date: res.data.date.split("T")[0], // format YYYY-MM-DD
        });
        setLoading(false);
      } catch (err) {
        console.error("Error fetching expense", err.response?.data || err);
      }
    };
    fetchExpense();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExpense((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:5000/api/expenses/${id}`,
        {
          ...expense,
          amount: Number(expense.amount),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Expense updated successfully!");
      navigate("/expenses"); // back to expenses list
    } catch (err) {
      console.error("Error updating expense", err.response?.data || err);
      alert("Failed to update expense.");
    }
  };

  if (loading) return <p className="p-6">Loading expense details...</p>;

  return (
    <div className="flex justify-center p-6">
      <form
        className="w-full max-w-md bg-white p-6 rounded-lg shadow space-y-4"
        onSubmit={handleSubmit}
      >
        <h2 className="text-xl font-semibold mb-4">Edit Expense</h2>

        <input
          type="number"
          name="amount"
          placeholder="Amount"
          className="w-full p-2 border rounded"
          value={expense.amount}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="description"
          placeholder="Description"
          className="w-full p-2 border rounded"
          value={expense.description}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="category"
          placeholder="Category"
          className="w-full p-2 border rounded"
          value={expense.category}
          onChange={handleChange}
          required
        />

        <select
          name="type"
          value={expense.type}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select Type</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <input
          type="date"
          name="date"
          className="w-full p-2 border rounded"
          value={expense.date}
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          Update Expense
        </button>
      </form>
    </div>
  );
};

export default EditExpense;
