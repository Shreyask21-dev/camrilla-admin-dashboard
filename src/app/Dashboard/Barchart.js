// components/BarChart.js
'use client';
import React from 'react';
import ReactApexChart from 'react-apexcharts';

export default function BarChart() {
  const options = {
    chart: {
      type: 'bar',
      height: 400,
      stacked: true,
      toolbar: { show: false }
    },
    plotOptions: {
      bar: {
        columnWidth: '15%',
        borderRadius: 4
      }
    },
    dataLabels: { enabled: false },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: ['7/12', '8/12', '9/12', '10/12', '11/12', '12/12', '13/12', '14/12', '15/12', '16/12']
    },
    yaxis: {
      title: {
        text: 'Revenue'
      }
    },
    fill: {
      opacity: 1
    },
    legend: {
      position: 'top',
      horizontalAlign: 'left'
    },
    colors: ['#826af9', '#210e75']
  };

  const series = [
    {
      name: 'Year',
      data: [90, 120, 55, 100, 80, 125, 175, 70, 88, 180]
    },
    {
      name: 'Month',
      data: [85, 100, 30, 40, 95, 90, 30, 110, 62, 20]
    }
  ];

  return (
    <ReactApexChart options={options} series={series} type="bar" height={400} />
  );
}
