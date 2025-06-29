import { Bar } from "react-chartjs-2";
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import { useEffect, useState } from "react";
Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function DashboardChart() {
  const [counts, setCounts] = useState({ new: 0, accept: 0, reject: 0 });

  useEffect(() => {
    Promise.all([
      fetch("/api/students/count?status=new").then(res => res.json()),
      fetch("/api/students/count?status=accept").then(res => res.json()),
      fetch("/api/students/count?status=reject").then(res => res.json()),
    ]).then(([newData, acceptData, rejectData]) => {
      setCounts({
        new: newData.count || 0,
        accept: acceptData.count || 0,
        reject: rejectData.count || 0,
      });
    });
  }, []);

  const data = {
    labels: ["New", "Accepted", "Rejected"],
    datasets: [
      {
        label: "Students",
        data: [counts.new, counts.accept, counts.reject],
        backgroundColor: ["#60a5fa", "#34d399", "#f87171"],
      },
    ],
  };

  return (
    <div className="bg-white p-6 shadow rounded mb-6">
      <h3 className="text-lg font-bold mb-4 text-center">Students Overview</h3>
      <Bar data={data} options={{ responsive: true, plugins: { legend: { display: false } } }} />
    </div>
  );
}
export default DashboardChart;