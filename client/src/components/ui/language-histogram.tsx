import { Language } from "@shared/schema";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface LanguageHistogramProps {
  languages: Language[];
}

export function LanguageHistogram({ languages }: LanguageHistogramProps) {
  const chartData = {
    labels: languages.map(lang => lang.name),
    datasets: [
      {
        label: 'Questions per Language',
        data: languages.map(lang => lang.count),
        backgroundColor: [
          'rgba(99, 102, 241, 0.5)', // primary
          'rgba(59, 130, 246, 0.5)', // blue-500
          'rgba(168, 85, 247, 0.5)', // purple-500
          'rgba(96, 165, 250, 0.5)', // blue-400
          'rgba(245, 158, 11, 0.5)', // amber-500
          'rgba(34, 197, 94, 0.5)',  // green-500
        ],
        borderColor: [
          'rgb(99, 102, 241)',
          'rgb(59, 130, 246)',
          'rgb(168, 85, 247)',
          'rgb(96, 165, 250)',
          'rgb(245, 158, 11)',
          'rgb(34, 197, 94)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const lang = languages[context.dataIndex];
            return `Count: ${lang.count} (${lang.percentage}%)`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (
    <div className="h-full w-full">
      <Bar data={chartData} options={options} />
    </div>
  );
}
