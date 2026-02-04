'use client';

import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import { motion } from 'framer-motion';
import { FaChartLine, FaTrendingUp, FaTrendingDown } from 'react-icons/fa';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function TrendChart({ trend, color, label, title, subtitle }) {
  const days = ['6d ago','5d ago','4d ago','3d ago','2d ago','1d ago','Today'];
  
  // Calculate trend direction
  const currentValue = trend[trend.length - 1];
  const previousValue = trend[trend.length - 2];
  const trendDirection = currentValue > previousValue ? 'up' : currentValue < previousValue ? 'down' : 'stable';
  const trendPercentage = previousValue ? Math.abs(((currentValue - previousValue) / previousValue) * 100).toFixed(1) : 0;

  // Create gradient
  const gradientColor = color || '#f97316';
  
  const chartData = {
    labels: days,
    datasets: [{
      label: label || 'Count',
      data: trend,
      backgroundColor: (context) => {
        const chart = context.chart;
        const {ctx, chartArea} = chart;
        if (!chartArea) return gradientColor;
        
        const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
        gradient.addColorStop(0, gradientColor + '20');
        gradient.addColorStop(1, gradientColor + 'CC');
        return gradient;
      },
      borderColor: gradientColor,
      borderWidth: 2,
      borderRadius: 6,
      borderSkipped: false,
      maxBarThickness: 16,
      tension: 0.4
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index',
    },
    plugins: {
      legend: { 
        display: false 
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: gradientColor,
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          title: (tooltipItems) => {
            return tooltipItems[0].label;
          },
          label: (context) => {
            return `${context.dataset.label}: ${context.raw}`;
          }
        }
      }
    },
    scales: {
      x: { 
        ticks: { 
          color: '#6b7280', 
          font: { 
            size: 11,
            weight: '500'
          },
          maxRotation: 0
        },
        grid: { 
          display: false 
        },
        border: {
          display: false
        }
      },
      y: { 
        ticks: { 
          color: '#6b7280', 
          font: { 
            size: 11,
            weight: '500'
          }, 
          stepSize: 1,
          callback: function(value) {
            return Number.isInteger(value) ? value : '';
          }
        },
        grid: { 
          drawTicks: false, 
          borderDash: [3, 3],
          color: 'rgba(107, 114, 128, 0.2)'
        },
        border: {
          display: false
        },
        beginAtZero: true
      }
    },
    animation: {
      duration: 1000,
      easing: 'easeOutQuart'
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-yellow-500 flex items-center justify-center">
            <FaChartLine className="text-white" size={16} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              {title || `${label} Trend`}
            </h3>
            {subtitle && (
              <p className="text-sm text-gray-600">{subtitle}</p>
            )}
          </div>
        </div>
        
        {/* Trend indicator */}
        <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-semibold ${
          trendDirection === 'up' ? 'bg-green-100 text-green-700' :
          trendDirection === 'down' ? 'bg-red-100 text-red-700' :
          'bg-gray-100 text-gray-700'
        }`}>
          {trendDirection === 'up' ? (
            <FaTrendingUp size={12} />
          ) : trendDirection === 'down' ? (
            <FaTrendingDown size={12} />
          ) : (
            <div className="w-3 h-3 bg-current rounded-full"></div>
          )}
          <span>{trendPercentage}%</span>
        </div>
      </div>

      {/* Chart */}
      <div className="h-32 mb-4">
        <Bar data={chartData} options={options} />
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900">{Math.max(...trend)}</div>
          <div className="text-xs text-gray-500">Peak</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900">{Math.min(...trend)}</div>
          <div className="text-xs text-gray-500">Low</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900">
            {(trend.reduce((a, b) => a + b, 0) / trend.length).toFixed(1)}
          </div>
          <div className="text-xs text-gray-500">Avg</div>
        </div>
      </div>
    </motion.div>
  );
}
