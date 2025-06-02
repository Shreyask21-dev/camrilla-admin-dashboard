// "use client";
// import React, { useEffect } from "react";
// import ApexCharts from "apexcharts";

// export default function ChartsPage() {
//  useEffect(() => {
//   let scatterChart, donutChart;

//   const scatterChartEl = document.querySelector("#scatterChart");
//   const donutChartEl = document.querySelector("#donutChart");

//   if (scatterChartEl) {
//     scatterChart = new ApexCharts(scatterChartEl, {
//       chart: {
//         id: "scatterChart",
//         height: 400,
//         fontFamily: "Inter",
//         type: "scatter",
//         zoom: {
//           enabled: true,
//           type: "xy"
//         },
//         toolbar: {
//           show: false
//         }
//       },
//       series: [
//         {
//           name: "Basic Plan",
//           data: [
//             [5.4, 170],
//             [5.4, 100],
//             [5.7, 110],
//             [5.9, 150],
//             [6.0, 200],
//             [6.3, 170],
//             [5.7, 140],
//             [5.9, 130],
//             [7.0, 150],
//             [8.0, 120]
//           ]
//         },
//         {
//           name: "Expert Plan",
//           data: [
//             [14.0, 220],
//             [15.0, 280],
//             [16.0, 230],
//             [18.0, 320],
//             [17.5, 280]
//           ]
//         },
//         {
//           name: "Event Plan",
//           data: [
//             [14.0, 290],
//             [13.0, 190],
//             [20.0, 220],
//             [21.0, 350],
//             [21.5, 290]
//           ]
//         }
//       ],
//       colors: ["#FDD835", "#7367F0", "#29DAC7"],
//       xaxis: {
//         tickAmount: 10,
//         labels: {
//           formatter: (val) => parseFloat(val).toFixed(1),
//           style: {
//             fontSize: "13px"
//           }
//         }
//       },
//       yaxis: {
//         labels: {
//           style: {
//             fontSize: "13px"
//           }
//         }
//       },
//       legend: {
//         position: "top",
//         horizontalAlign: "start"
//       }
//     });
//     scatterChart.render();
//   }

//   if (donutChartEl) {
//     donutChart = new ApexCharts(donutChartEl, {
//       chart: {
//         id: "donutChart",
//         height: 390,
//         fontFamily: "Inter",
//         type: "donut"
//       },
//       labels: ["India", "Mexico", "Argentina", "South Africa"],
//       series: [42, 7, 25, 25],
//       colors: ["#FDD835", "#FFA1A1", "#7367F0", "#29DAC7"],
//       dataLabels: {
//         enabled: true,
//         formatter: (val) => `${parseInt(val, 10)}%`,
//         style: {
//           fontSize: "15px"
//         }
//       },
//       legend: {
//         position: "bottom",
//         fontSize: "13px",
//         markers: {
//           width: 10,
//           height: 10
//         }
//       }
//     });
//     donutChart.render();
//   }

//   return () => {
//     if (scatterChart) scatterChart.destroy();
//     if (donutChart) donutChart.destroy();
//   };
// }, []);


//   return (
//     <div className="container mt-5">
//       <div className="row">

//         {/* Scatter Chart */}
//         <div className="col-12 mb-4">
//           <div className="card shadow-sm">
//             <div className="card-header">
//               <h5 className="mb-0">Revenue by Plans (Scatter Chart)</h5>
//             </div>
//             <div className="card-body">
//               <div id="scatterChart"></div>
//             </div>
//           </div>
//         </div>

//         {/* Donut Chart */}
//         <div className="col-12 mb-4">
//           <div className="card shadow-sm">
//             <div className="card-header">
//               <h5 className="mb-0">Revenue by Country (Donut Chart)</h5>
//             </div>
//             <div className="card-body">
//               <div id="donutChart"></div>
//             </div>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// }
// // 