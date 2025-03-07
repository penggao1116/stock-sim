import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function LiveUpdatingChart({ symbol }) {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: `${symbol} Live Prices`,
        data: [],
        borderColor: '#2563eb',
        fill: false,
      },
    ],
  });

  // Reset chart when symbol changes
  useEffect(() => {
    setChartData({
      labels: [],
      datasets: [
        {
          label: `${symbol} Live Prices`,
          data: [],
          borderColor: '#2563eb',
          fill: false,
        },
      ],
    });
  }, [symbol]);

  useEffect(() => {
    const fetchCurrentPrice = async () => {
      try {
        const response = await axios.get(
          `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${process.env.REACT_APP_FINNHUB_API_KEY}`
        );
        if (response.data && response.data.c) {
          const currentPrice = response.data.c;
          const now = new Date();
          const timeLabel = now.toLocaleTimeString();
          setChartData(prevData => ({
            labels: [...prevData.labels, timeLabel],
            datasets: [
              {
                ...prevData.datasets[0],
                data: [...prevData.datasets[0].data, currentPrice],
              },
            ],
          }));
        } else {
          console.error('Invalid price data:', response.data);
        }
      } catch (error) {
        console.error('Error fetching live price:', error);
      }
    };

    // Fetch immediately and then every 2 seconds
    fetchCurrentPrice();
    const intervalId = setInterval(fetchCurrentPrice, 2000);
    return () => clearInterval(intervalId);
  }, [symbol]);

  return (
    <div style={{ marginTop: '1rem' }}>
      {chartData.labels.length > 0 ? (
        <Line data={chartData} />
      ) : (
        <p>Loading chart...</p>
      )}
    </div>
  );
}

export default LiveUpdatingChart;
