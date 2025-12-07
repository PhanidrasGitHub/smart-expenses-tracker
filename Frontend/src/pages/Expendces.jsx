import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Expenses = () => {
  const navigate = useNavigate();

  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState([]);
  const [stats, setStats] = useState({});
  const [category, setCategory] = useState("");
  const [month, setMonth] = useState("");
  const [sortByAmount, setSortByAmount] = useState(false);
  const [search, setSearch] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchExpenses();
    fetchSummary();
    fetchStats();
  }, [category, month, sortByAmount]);

  // FETCH EXPENSES
  const fetchExpenses = async (keyword) => {
    try {
      let url = "http://localhost:5000/api/expenses";

      if (keyword) url += `/search?keyword=${encodeURIComponent(keyword)}`;
      else if (sortByAmount) url += "/sort?by=amount";
      else if (category || month) {
        const params = new URLSearchParams();
        if (category) params.append("category", category);
        if (month) params.append("month", month);
        url += `/filter?${params.toString()}`;
      }

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExpenses(res.data);
    } catch (err) {
      console.error("Error loading expenses", err.response?.data || err);
    }
  };

  // FETCH SUMMARY
  const fetchSummary = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/expenses/summary", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSummary(res.data);
    } catch (err) {
      console.error("Error fetching summary", err.response?.data || err);
    }
  };

  // FETCH STATISTICS
  const fetchStats = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/expenses/statistics", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(res.data);
    } catch (err) {
      console.error("Error fetching stats", err.response?.data || err);
    }
  };

  // DELETE SINGLE
  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Delete this expense?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/expenses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExpenses(expenses.filter((e) => e._id !== id));
      fetchSummary();
      fetchStats();
    } catch (err) {
      console.error("Error deleting expense", err.response?.data || err);
    }
  };

  // DELETE ALL
  const handleDeleteAll = async () => {
    if (!window.confirm("Delete ALL expenses? This cannot be undone.")) return;
    try {
      await axios.delete("http://localhost:5000/api/expenses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchExpenses();
      fetchSummary();
      fetchStats();
    } catch (err) {
      console.error("Error deleting all expenses", err.response?.data || err);
    }
  };

  // NAVIGATE TO UPDATE
  const handleUpdate = (id, e) => {
    e.stopPropagation();
    navigate(`/expenses/edit/${id}`);
  };

  const handleSearchKey = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      fetchExpenses(search);
    }
  };

  const totalExpense = summary?.find((s) => s._id === "expense")?.totalAmount || 0;
  const totalIncome = summary?.find((s) => s._id === "income")?.totalAmount || 0;
  const balance = totalIncome - totalExpense;
  const categoryTotals = stats?.totalByCategory || [];

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-6 margin-top-10px pt-20">
      {/* LEFT PANEL: Filters */}
      <div className="w-full lg:w-1/4 bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Filters & Sorting</h2>

        {/* Search */}
        <label className="block text-sm font-medium mb-1">Search</label>
        <input
          type="text"
          placeholder="Keyword & Enter/Space"
          className="w-full p-2 border rounded mb-4"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleSearchKey}
        />

        {/* Category */}
        <label className="block text-sm font-medium mb-1">Category</label>
        <select
          className="w-full p-2 border rounded mb-4"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All</option>
          <option value="Rent">Rent</option>
          <option value="Food">Food</option>
          <option value="Travel">Travel</option>
          <option value="Shopping">Shopping</option>
          <option value="Utilities">Utilities</option>
        </select>

        {/* Month */}
        <label className="block text-sm font-medium mb-1">Month</label>
        <select
          className="w-full p-2 border rounded mb-4"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        >
          <option value="">All</option>
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {new Date(0, i).toLocaleString("default", { month: "short" })}
            </option>
          ))}
        </select>

        {/* Sort by Amount */}
        <label className="flex items-center gap-2 mt-4 cursor-pointer">
          <input
            type="checkbox"
            checked={sortByAmount}
            onChange={(e) => setSortByAmount(e.target.checked)}
          />
          <span className="text-sm font-medium">Sort by Amount</span>
        </label>
      </div>

      {/* RIGHT PANEL: Summary + Stats + Expenses */}
      <div className="w-full lg:w-3/4 space-y-4">
        {/* SUMMARY */}
        <div className="grid grid-cols-3 gap-4 bg-white p-4 rounded-lg shadow text-center">
          <div>
            <p className="text-gray-500">Total Spent</p>
            <h2 className="text-lg font-bold ">₹{totalExpense}</h2>
          </div>
          <div>
            <p className="text-gray-500">Total Income</p>
            <h2 className="text-lg font-bold">₹{totalIncome}</h2>
          </div>
          <div>
            <p className="text-gray-500">Balance</p>
            <h2 className="text-lg font-bold">₹{balance}</h2>
          </div>
        </div>

        {/* CATEGORY TOTALS */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold mb-2">Category Totals</h3>
          <div className="flex flex-wrap gap-4">
            {categoryTotals.map((cat) => (
              <div
                key={cat._id}
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
              >
                {cat._id}: ₹{cat.totalAmount}
              </div>
            ))}
          </div>
        </div>

        {/* EXPENSE LIST */}
        <div className="space-y-3">
          <button
            className="bg-red-500 text-white rounded px-4 py-2"
            onClick={handleDeleteAll}
          >
            Delete All
          </button>

          {expenses.length === 0 ? (
            <p className="text-gray-500 mt-4">No expenses found.</p>
          ) : (
            expenses.map((item) => (
              <div
                key={item._id}
                className="p-4 bg-white rounded-lg shadow flex justify-between items-center cursor-pointer"
                onClick={() => navigate(`/expenses/edit/${item._id}`)}
              >
                <div>
                  <h3 className="text-lg font-semibold">{item.description}</h3>
                  <p className="text-sm text-gray-500">
                    {item.category} | {item.type}
                  </p>
                </div>

                <div className="text-right flex flex-col items-end gap-1">
                  <p className="font-bold text-blue-600">₹{item.amount}</p>
                  <p className="text-sm text-gray-400">
                    {new Date(item.date).toLocaleDateString()}
                  </p>
                  <div className="flex gap-2 mt-1">
                    <button
                      className="text-yellow-600 text-sm hover:underline"
                      onClick={(e) => handleUpdate(item._id, e)}
                    >
                      Update
                    </button>
                    <button
                      className="text-red-600 text-sm hover:underline"
                      onClick={(e) => handleDelete(item._id, e)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Expenses;
