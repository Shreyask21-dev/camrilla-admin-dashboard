"use client";
import React, { useEffect, useState } from "react";

export default function FeedbackPage() {
  const [feedbackData, setFeedbackData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/feedback");
        const data = await res.json();
        setFeedbackData(data);
      } catch (error) {
        console.error("Error fetching feedback:", error);
      }
    };

    fetchFeedback();
  }, []);

  const totalPages = Math.ceil(feedbackData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = feedbackData.slice(startIndex, startIndex + itemsPerPage);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="content-wrapper">
      <div className="container-xxl flex-grow-1 container-p-y">
        <div className="card">
          <h5 className="card-header">User Feedback List</h5>
          <div className="table-responsive text-nowrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Sr. No</th>
                  <th>User ID</th>
                  <th>Email</th>
                  <th>Feedback</th>
                  <th>Feedback Date</th>
                </tr>
              </thead>
              <tbody className="table-border-bottom-0">
                {currentItems.map((item, index) => (
                  <tr
                    key={item.id}
                    style={{
                      backgroundColor: index % 2 === 0 ? "#f8f9fa" : "#ffffff", // Alternating row colors
                    }}
                  >
                    <td>{startIndex + index + 1}</td>
                    <td>{item.user_id}</td>
                    <td>{item.email}</td>
                    <td>
                      <div
                        style={{
                          whiteSpace: "pre-wrap",
                          wordWrap: "break-word",
                          maxWidth: "400px",
                        }}
                      >
                        {item.feedback}
                      </div>
                    </td>
                    <td>{item.feedback_date.split(" ")[0]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Centered and Styled Pagination */}
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
                  <span
                    className="page-link"
                    style={{
                      padding: "6px 12px",
                      backgroundColor: "#ffffff",
                      color: "#0d6efd",
                      border: "1px solid #0d6efd",
                      fontWeight: "bold",
                    }}
                  >
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
