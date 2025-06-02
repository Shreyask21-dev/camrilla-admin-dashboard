// "use client";
// import React, { useEffect } from "react";
// import ApexCharts from "apexcharts";

// const countryMeta = {
//   IN: { name: "India", symbol: "₹" },
//   MY: { name: "Malaysia", symbol: "RM" },
//   AU: { name: "Australia", symbol: "A$" },
//   US: { name: "United States", symbol: "$" },
//   GB: { name: "United Kingdom", symbol: "£" },
//   NG: { name: "Nigeria", symbol: "₦" },
// };

// export default function RevenuePage() {
//   useEffect(() => {
//     // Donut Chart
//     const donutChart = new ApexCharts(document.querySelector("#donutChart"), {
//       chart: { height: 390, type: "donut", fontFamily: "Inter" },
//       labels: ["India", "Mexico", "Argentina", "South Africa"],
//       series: [42, 7, 25, 25],
//       colors: ["#fdd835", "#ffa1a1", "#7367f0", "#29dac7"],
//       dataLabels: {
//         enabled: true,
//         formatter: (val) => `${parseInt(val, 10)}%`,
//         style: { fontSize: "15px" },
//       },
//       legend: {
//         position: "bottom",
//         fontSize: "13px",
//         markers: { width: 10, height: 10 },
//       },
//     });
//     donutChart.render();

//     // Bar Chart
//     const barChart = new ApexCharts(document.querySelector("#barChart"), {
//       chart: { height: 400, type: "bar", stacked: true, fontFamily: "Inter" },
//       series: [
//         { name: "Year", data: [90, 120, 55, 100, 80, 125, 175, 70, 88, 180] },
//         { name: "Month", data: [85, 100, 30, 40, 95, 90, 30, 110, 62, 20] },
//       ],
//       xaxis: {
//         categories: ["7/12", "8/12", "9/12", "10/12", "11/12", "12/12", "13/12", "14/12", "15/12", "16/12"],
//       },
//       colors: ["#826af9", "#210e75"],
//       legend: { position: "top" },
//     });
//     barChart.render();

//     // Radial Chart
//     const radialChart = new ApexCharts(document.querySelector("#radialChart"), {
//       chart: { height: 380, type: "radialBar", fontFamily: "Inter", id: "radialChart" },
//       series: [80, 50, 35],
//       labels: ["Comments", "Replies", "Shares"],
//       colors: ["#fdd835", "#32baff", "#7367f0"],
//       plotOptions: {
//         radialBar: {
//           hollow: { size: "40%" },
//           dataLabels: {
//             name: { fontSize: "22px" },
//             value: { fontSize: "16px" },
//             total: {
//               show: true,
//               label: "Comments",
//               formatter: () => "80%",
//             },
//           },
//         },
//       },
//       legend: {
//         show: true,
//         position: "bottom",
//         fontSize: "13px",
//         markers: { width: 10, height: 10 },
//       },
//     });
//     radialChart.render();

//     // Revenue Line Chart (Monthly)
//  const fetchAndRenderLineChart = async () => {
//   const res = await fetch("https://camrilla-admin-backend.onrender.com/api/revenue/month-year");
//   const data = await res.json();

//   // Sort by month_year ascending (e.g. "2024-02")
//   const sorted = data.sort((a, b) => new Date(a.month_year) - new Date(b.month_year));
//   const labels = sorted.map((item) => item.month_year);
//   const values = sorted.map((item) => item.total_revenue);
//    const yearChangeIndexes = [];
//   let lastYear = sorted[0]?.year;
//   sorted.forEach((item, idx) => {
//     if (item.year !== lastYear) {
//       yearChangeIndexes.push(idx - 0.5); // position between ticks
//       lastYear = item.year;
//     }
//   });
//   const options = {
//     chart: {
//       id: "revenueLineChart",
//       type: "line",
//       height: 400,
//       fontFamily: "Inter",
//       toolbar: { show: false },
//       animations:{enabled:true}
//     },
//     series: [
//       {
//         name: "Revenue",
//         data: values,
//       },
//     ],
//     xaxis: {
//       categories: labels,
//       title: {
//         text: "Month-Year",
//       },
//     },
//     stroke: {
//       curve: "smooth",
//       width: 3,
//       colors: ["#054a91"],
//     },
//     markers: {
//       size: 5,
//       colors: ["#054a91"],
//       strokeWidth: 2,
//       strokeColors: "#fff",
//       hover: {
//         size: 7,
//       },
//     },
//     fill: {
//       type: "gradient",
//       gradient: {
//         shade: "dark",
//         type: "vertical",
//         shadeIntensity: 0.4,
//         gradientToColors: ["#021f40"], 
//         opacityFrom: 0.6,
//         opacityTo: 0.1,
//         stops: [0, 90, 100],
//       },
//     },
//    colors: ["#054a91"],
//     tooltip: {
//       y: {
//         formatter: (val) => `₹${val.toLocaleString()}`,
//       },
//     },
//   };

//   // Destroy existing chart instance if exists to avoid duplicates
//   try {
//     await ApexCharts.exec("revenueLineChart", "destroy");
//   } catch {}

//   const chart = new ApexCharts(document.querySelector("#revenueLineChart"), options);
//   chart.render();
// };

// fetchAndRenderLineChart();


//     // Revenue by Country Bar
//     fetch("https://camrilla-admin-backend.onrender.com/api/revenue/country")
//       .then((res) => res.json())
//       .then((data) => {
//         const fullNames = data.map((entry) => countryMeta[entry.country]?.name || entry.country);
//         const symbols = data.map((entry) => countryMeta[entry.country]?.symbol || "");
//         const revenues = data.map((entry) => entry.total_revenue);

//         const countryBarChart = new ApexCharts(document.querySelector("#countryBarChart"), {
//           chart: { height: 380, type: "bar", fontFamily: "Inter", id: "countryBarChart" },
//           series: [{ name: "Revenue", data: revenues }],
//           xaxis: { categories: fullNames },
//           yaxis: {
//             type: "logarithmic",
//             labels: {
//               formatter: (val) => `${parseInt(val).toLocaleString()}`,
//             },
//           },
//           colors: ["#00b894"],
//           title: { text: "Revenue by Country", align: "center" },
//           dataLabels: { enabled: true },
//           tooltip: {
//             y: {
//               formatter: (val, { dataPointIndex }) => {
//                 const symbol = symbols[dataPointIndex] || "";
//                 return `${symbol}${val.toFixed(2)}`;
//               },
//             },
//           },
//         });

//         countryBarChart.render();
//       });

//     // Cleanup
//     return () => {
//       ApexCharts.exec("donutChart", "destroy");
//       ApexCharts.exec("barChart", "destroy");
//       ApexCharts.exec("radialChart", "destroy");
//       ApexCharts.exec("revenueLineChart", "destroy");
//       ApexCharts.exec("countryBarChart", "destroy");
//     };
//   }, []);

//   return (
//     <div className="container py-5">
//       <h2 className="mb-4 text-center">Revenue Overview</h2>
//       <div className="row">
//         {/* Revenue by Country (Bar) */}
//         <div className="col-12 mb-4">
//           <div className="card shadow-sm">
//             <div className="card-header">Revenue by Country (Bar)</div>
//             <div className="card-body">
//               <div id="countryBarChart"></div>
//             </div>
//           </div>
//         </div>

//         {/* Donut Chart */}
//         <div className="col-md-6 mb-4">
//           <div className="card shadow-sm">
//             <div className="card-header">Revenue by Country (Donut)</div>
//             <div className="card-body">
//               <div id="donutChart"></div>
//             </div>
//           </div>
//         </div>

//         {/* Bar Chart */}
//         <div className="col-md-6 mb-4">
//           <div className="card shadow-sm">
//             <div className="card-header">Monthly vs Yearly (Bar)</div>
//             <div className="card-body">
//               <div id="barChart"></div>
//             </div>
//           </div>
//         </div>

       

//         {/* New Line Chart for Revenue (Monthly) */}
//         <div className="col-12 mb-4">
//           <div className="card shadow-sm">
//             <div className="card-header">Monthly Revenue Trend (Line)</div>
//             <div className="card-body">
//               <div id="revenueLineChart"></div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
