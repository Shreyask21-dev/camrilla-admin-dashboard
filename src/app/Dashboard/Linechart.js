// components/LineChart.js
'use client';
import React from 'react';


export default function LineChart() {
  const options = {
    chart: {
      type: 'line',
      height: 400,
      toolbar: { show: false }
    },
    stroke: {
      curve: 'smooth',
      width: 3
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: [
        '7/12', '8/12', '9/12', '10/12', '11/12', '12/12',
        '13/12', '14/12', '15/12', '16/12', '17/12',
        '18/12', '19/12', '20/12', '21/12'
      ]
    },
    yaxis: {
      title: {
        text: 'Users'
      }
    },
    tooltip: {
      y: {
        formatter: val => `${val} users`
      }
    },
    colors: ['#FF9F43']
  };

  const series = [
    {
      name: 'Users',
      data: [280, 200, 220, 180, 270, 250, 70, 90, 200, 150, 160, 100, 150, 100, 50]
    }
  ];

  return (
    <ReactApexChart options={options} series={series} type="line" height={400} />
  );
}
