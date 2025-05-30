"use client";
import React, { useEffect } from "react";
import ApexCharts from "apexcharts";

export default function RevenuePage() {
  useEffect(() => {
    // Donut Chart
    const donutChart = new ApexCharts(document.querySelector("#donutChart"), {
      chart: { height: 390, type: "donut", fontFamily: "Inter" },
      labels: ["India", "Mexico", "Argentina", "South Africa"],
      series: [42, 7, 25, 25],
      colors: ["#fdd835", "#ffa1a1", "#7367f0", "#29dac7"],
      dataLabels: {
        enabled: true,
        formatter: (val) => `${parseInt(val, 10)}%`,
        style: { fontSize: "15px" }
      },
      legend: {
        position: "bottom",
        fontSize: "13px",
        markers: { width: 10, height: 10 }
      }
    });
    donutChart.render();

    // Bar Chart
    const barChart = new ApexCharts(document.querySelector("#barChart"), {
      chart: { height: 400, type: "bar", stacked: true, fontFamily: "Inter" },
      series: [
        { name: "Year", data: [90, 120, 55, 100, 80, 125, 175, 70, 88, 180] },
        { name: "Month", data: [85, 100, 30, 40, 95, 90, 30, 110, 62, 20] }
      ],
      xaxis: {
        categories: ["7/12", "8/12", "9/12", "10/12", "11/12", "12/12", "13/12", "14/12", "15/12", "16/12"]
      },
      colors: ["#826af9", "#210e75"],
      legend: { position: "top" }
    });
    barChart.render();

    // Radial Circle Chart
    const radialChart = new ApexCharts(document.querySelector("#radialChart"), {
      chart: { height: 380, type: "radialBar", fontFamily: "Inter" },
      series: [80, 50, 35],
      labels: ["Comments", "Replies", "Shares"],
      colors: ["#fdd835", "#32baff", "#7367f0"],
      plotOptions: {
        radialBar: {
          hollow: { size: "40%" },
          dataLabels: {
            name: { fontSize: "22px" },
            value: { fontSize: "16px" },
            total: {
              show: true,
              label: "Comments",
              formatter: () => "80%"
            }
          }
        }
      },
      legend: {
        show: true,
        position: "bottom",
        fontSize: "13px",
        markers: { width: 10, height: 10 }
      }
    });
    radialChart.render();

    return () => {
      ApexCharts.exec("donutChart", "destroy");
      ApexCharts.exec("barChart", "destroy");
      ApexCharts.exec("radialChart", "destroy");
    };
  }, []);

  return (
    <div className="container py-5">
      <h2 className="mb-4 text-center">Revenue Overview</h2>
      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card shadow-sm">
            <div className="card-header">Revenue by Country (Donut)</div>
            <div className="card-body">
              <div id="donutChart"></div>
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-4">
          <div className="card shadow-sm">
            <div className="card-header">Monthly vs Yearly (Bar)</div>
            <div className="card-body">
              <div id="barChart"></div>
            </div>
          </div>
        </div>
        <div className="col-12 mb-4">
          <div className="card shadow-sm">
            <div className="card-header">Engagement (Radial Circle)</div>
            <div className="card-body">
              <div id="radialChart"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
