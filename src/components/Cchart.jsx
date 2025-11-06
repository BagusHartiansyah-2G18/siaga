"use client";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Cchart({ data }) {
  // const data = {
  //   labels: ["Puas", "Biasa Saja", "Tidak Puas"],
  //   datasets: [
  //     {
  //       label: "Jumlah Feedback",
  //       // data: [10,22,22],
  //       backgroundColor: ["#22c55e", "#eab308", "#ef4444"],
  //     },
  //   ],
  // };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Feedback Masyarakat" },
    },
  };

  const handleFeedback = (type) => {
    setFeedbackCounts((prev) => ({
      ...prev,
      [type]: prev[type] + 1,
    }));
  };

  return (
    <div className="bg-white bg-gray-800 p-4 rounded-xl shadow-md">
      <h2 className="text-lg font-semibold mb-4 text-gray-800 text-white">
        Feedback Masyarakat
      </h2>
      <Bar data={data} options={options} />
    </div>
  );
}
