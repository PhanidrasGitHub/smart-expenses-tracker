import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { Chrono } from "react-chrono";

const Stats = ({ expenses }) => {
  if (!expenses || expenses.length === 0) return <p>No expenses to show</p>;

  const pieData = expenses.reduce((acc, exp) => {
    const item = acc.find(i => i.name === exp.category);
    if (item) item.value += exp.amount;
    else acc.push({ name: exp.category, value: exp.amount });
    return acc;
  }, []);

  const timelineData = expenses.map(exp => ({
    title: new Date(exp.date).toLocaleDateString(),
    cardTitle: exp.description,
    cardSubtitle: `₹${exp.amount}`,
  }));

  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-bold text-lg">Spending by Category</h2>
      <PieChart width={250} height={250}>
        <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
          {pieData.map((entry, index) => (
            <Cell key={index} fill={["#0088FE","#00C49F","#FFBB28","#FF8042"][index % 4]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>

      <h2 className="font-bold text-lg mt-4">Timeline</h2>
      <Chrono items={timelineData} mode="VERTICAL" />
    </div>
  );
};

export default Stats;
