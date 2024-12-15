import React from 'react';
import { Chart } from 'react-google-charts';
import { ChartData } from '../state/api/chartApi';
import { CircularProgress } from '@mui/material';

interface LifeChartProps {
  chartData: ChartData[];
  isLoading: boolean;
}

const LifeChart: React.FC<LifeChartProps> = ({ chartData, isLoading }) => {
  // Настройки графика
  const chartOptions = {
    legend: 'none',
    candlestick: {
      fallingColor: { strokeWidth: 0, fill: '#f43444' }, // Красный для падения
      risingColor: { strokeWidth: 0, fill: '#16ac80' }, // Зеленый для роста
    },
    backgroundColor: '#2C3659',
    bar: { groupWidth: '100%' },
    hAxis: {
      textStyle: {
        color: 'white',
        fontSize: 12,
        bold: true,
      },
    },
    vAxis: {
      textStyle: {
        color: 'white',
        fontSize: 12,
        bold: true,
      },
    },
  };

  if (chartData?.length < 20) {
    const emptyData = Array.from(
      { length: 20 - chartData.length },
      () =>
        ({
          date: '',
          position: [null, null],
        } as ChartData)
    );
    chartData = [...chartData, ...emptyData];
  }

  // Формируем данные для графика
  const data = [
    ['day', 'a', 'b', 'c', 'd'],
    ...(chartData || []).map((item, index) => [
      index % 2 === 0 ? item.date : '', // Дата
      item.position[0], // Нижняя граница тела свечи
      item.position[0], // Нижняя граница линии
      item.position[1], // Верхняя граница линии
      item.position[1], // Верхняя граница тела свечи
    ]),
  ];

  return (
    <div
      style={{ width: '100%', overflowY: 'hidden', backgroundColor: '#2C3659' }}
    >
      {isLoading ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '500px',
          }}
        >
          <CircularProgress color="info" />
        </div>
      ) : (
        <Chart
          chartType="CandlestickChart"
          style={{ width: '100%', height: '700px' }}
          data={data}
          className="w-full"
          options={chartOptions}
        />
      )}
    </div>
  );
};

export default LifeChart;
