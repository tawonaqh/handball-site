'use client';

import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

export default function TrendChart({ trend, color, label }) {
  const days = ['6d ago','5d ago','4d ago','3d ago','2d ago','1d ago','Today'];

  return (
    <div className="h-28">
      <Bar
        data={{
          labels: days,
          datasets: [{
            label: label || 'Count',
            data: trend,
            backgroundColor: color,
            borderRadius: 4,
            maxBarThickness: 12
          }],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              enabled: true,
              callbacks: {
                label: (ctx) => `${ctx.dataset.label}: ${ctx.raw}`
              }
            }
          },
          scales: {
            x: { 
              ticks: { color: '#555', font: { size: 10 } },
              grid: { display: false }
            },
            y: { 
              ticks: { color: '#555', font: { size: 10 }, stepSize: 1 },
              grid: { drawTicks: false, borderDash: [2,2] }
            }
          },
        }}
      />
    </div>
  );
}
