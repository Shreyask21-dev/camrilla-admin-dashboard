"use client";
import React, { useEffect, useState, useMemo } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function FeedbackPage() {
  const [feedbackData, setFeedbackData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const res = await fetch("https://camrilla-admin-backend.onrender.com/api/feedback");
        const data = await res.json();
        setFeedbackData(data);
      } catch (error) {
        console.error("Error fetching feedback:", error);
      }
    };

    fetchFeedback();
  }, []);

  // Move sortedData ABOVE totalPages & currentItems
  const sortedData = useMemo(() => {
    const sorted = [...feedbackData];
    if (sortConfig.key !== null) {
      sorted.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return sorted;
  }, [feedbackData, sortConfig]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = sortedData.slice(startIndex, startIndex + itemsPerPage);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(feedbackData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Feedback");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "user_feedback.xlsx");
  };

  return (
    <div className="content-wrapper">
      <div className="container-xxl flex-grow-1 container-p-y">
        <div className="card">
          <h5 className="card-header d-flex justify-content-between">
            <span>User Feedback List</span>
            <button
              onClick={exportToExcel}
              style={{
                backgroundColor: "#28a745",
                color: "white",
                padding: "6px 12px",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Download Excel
            </button>
          </h5>

          <div className="table-responsive text-nowrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Sr. No</th>
                  <th onClick={() => requestSort("user_id")} style={{ cursor: "pointer" }}>User ID</th>
                  <th onClick={() => requestSort("email")} style={{ cursor: "pointer" }}>Email</th>
                  <th onClick={() => requestSort("mobile")} style={{ cursor: "pointer" }}>Mobile</th>
                  <th onClick={() => requestSort("feedback")} style={{ cursor: "pointer" }}>Feedback</th>
                  <th onClick={() => requestSort("feedback_date")} style={{ cursor: "pointer" }}>Feedback Date</th>
                </tr>
              </thead>
              <tbody className="table-border-bottom-0">
                {currentItems.map((item, index) => (
                  <tr key={item.id} style={{ backgroundColor: index % 2 === 0 ? "#f8f9fa" : "#ffffff" }}>
                    <td>{startIndex + index + 1}</td>
                    <td>{item.user_id}</td>
                    <td>{item.email}</td>
                    <td>{item.mobile}</td>
                    <td style={{ whiteSpace: "pre-wrap", wordWrap: "break-word", maxWidth: "400px" }}>
                      {item.feedback}
                    </td>
                    <td>{item.feedback_date?.split(" ")[0]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="d-flex justify-content-center p-3">
            <nav>
              <ul className="pagination mb-0">
                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                  <button
                    className="page-link"
                    onClick={handlePrevPage}
                    style={{
                      borderRadius: "5px 0 0 5px",
                      cursor: "pointer",
                      padding: "6px 12px",
                      backgroundColor: "#0d6efd",
                      color: "white",
                      border: "1px solid #0d6efd",
                    }}
                  >
                    &lt;
                  </button>
                </li>
                <li className="page-item active">
                  <span className="page-link" style={{
                    padding: "6px 12px",
                    backgroundColor: "#ffffff",
                    color: "#0d6efd",
                    border: "1px solid #0d6efd",
                    fontWeight: "bold"
                  }}>
                    {currentPage}
                  </span>
                </li>
                <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                  <button
                    className="page-link"
                    onClick={handleNextPage}
                    style={{
                      borderRadius: "0 5px 5px 0",
                      cursor: "pointer",
                      padding: "6px 12px",
                      backgroundColor: "#0d6efd",
                      color: "white",
                      border: "1px solid #0d6efd",
                    }}
                  >
                    &gt;
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
