"use client";
import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";

export default function Page() {
  const [transactions, setTransactions] = useState([]);
  const [users, setUsers] = useState([]);
  const [userTransactions, setUserTransactions] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionPage, setTransactionPage] = useState(1);
  const [userPage, setUserPage] = useState(1);
  const [userTxnPage, setUserTxnPage] = useState(1);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [userSortColumn, setUserSortColumn] = useState(null);
  const [userSortOrder, setUserSortOrder] = useState("asc");
  const [txnSortColumn, setTxnSortColumn] = useState(null);
  const [txnSortOrder, setTxnSortOrder] = useState("asc");
  const [transactionSearch, setTransactionSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    fetch("https://camrilla-admin-backend.onrender.com/api/transactions")
      .then((res) => res.json())
      .then((data) => setTransactions(data))
      .catch((err) => console.error("Transaction fetch error:", err));

    fetch("https://camrilla-admin-backend.onrender.com/api/users-with-transactions")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("User fetch error:", err));
  }, []);

  const paginate = (data, page) => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return data.slice(start, start + ITEMS_PER_PAGE);
  };

  // const totalTransactionPages = Math.ceil(transactions.length / ITEMS_PER_PAGE);
  // const totalUserPages = Math.ceil(users.length / ITEMS_PER_PAGE);
  // const totalUserTxnPages = Math.ceil(userTransactions.length / ITEMS_PER_PAGE);

  const handleViewTransactions = async (userId, name) => {
    try {
      const res = await fetch(
        `https://camrilla-admin-backend.onrender.com/api/transactions/${userId}`
      );
      const data = await res.json();
      setUserTransactions(data);
      setSelectedUser(name);
      setUserTxnPage(1);
      setIsModalOpen(true);
    } catch (err) {
      console.error("Error fetching user transactions:", err);
    }
  };

  const exportExcel = (data, filename) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Transactions");
    XLSX.writeFile(wb, filename);
  };
  // Filter + Deduplicate Transactions
  const seenTxns = new Set();
  const filteredTransactions = transactions
    .filter((txn) => {
      const keyword = transactionSearch.toLowerCase();
      return (
        txn.user_name?.toLowerCase().includes(keyword) ||
        txn.email?.toLowerCase().includes(keyword) ||
        txn.mobile?.toString().includes(keyword)
      );
    })
    .filter((txn) => {
      if (seenTxns.has(txn.transaction_id)) return false;
      seenTxns.add(txn.transaction_id);
      return true;
    });

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (!txnSortColumn) return 0;
    const aVal = a[txnSortColumn];
    const bVal = b[txnSortColumn];
    if (typeof aVal === "string")
      return txnSortOrder === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    return txnSortOrder === "asc" ? aVal - bVal : bVal - aVal;
  });

  const totalTransactionPages = Math.ceil(
    filteredTransactions.length / ITEMS_PER_PAGE
  );

  // Filter Users
  const filteredUsers = users.filter((user) => {
    const keyword = userSearch.toLowerCase();
    return (
      user.name?.toLowerCase().includes(keyword) ||
      user.email?.toLowerCase().includes(keyword) ||
      user.mobile?.toString().includes(keyword)
    );
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (!userSortColumn) return 0;
    const aVal = a[userSortColumn];
    const bVal = b[userSortColumn];
    if (typeof aVal === "string")
      return userSortOrder === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    return userSortOrder === "asc" ? aVal - bVal : bVal - aVal;
  });

  const totalUserPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);

  return (
    <div className="content-wrapper">
      <div className="container-xxl flex-grow-1 container-p-y">
        {/* Transaction History */}
        <div className="card mb-5">
          <div className="card-header d-flex justify-content-between flex-wrap gap-2 align-items-center">
            <h5 className="mb-0">Transaction History</h5>
            <input
              type="text"
              className="form-control"
              placeholder="Search by name/email/mobile"
              style={{ maxWidth: 300 }}
              value={transactionSearch}
              onChange={(e) => setTransactionSearch(e.target.value)}
            />
            <button
              className="btn btn-sm btn-primary"
              onClick={() => exportExcel(transactions, "all_transactions.xlsx")}
            >
              Export Excel
            </button>
          </div>

          <div className="table-responsive text-nowrap">
            <table className="table">
              <thead>
                <tr>
                  {[
                    "transaction_id",
                    "user_name",
                    "email",
                    "amount",
                    "payment_date",
                    "payment_method",
                    "payment_status",
                    "reference_id",
                  ].map((col) => (
                    <th
                      key={col}
                      onClick={() => {
                        if (txnSortColumn === col) {
                          setTxnSortOrder(
                            txnSortOrder === "asc" ? "desc" : "asc"
                          );
                        } else {
                          setTxnSortColumn(col);
                          setTxnSortOrder("asc");
                        }
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      {col.replace(/_/g, " ").toUpperCase()}{" "}
                      {txnSortColumn === col
                        ? txnSortOrder === "asc"
                          ? "▲"
                          : "▼"
                        : ""}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="table-border-bottom-0">
               {paginate(sortedTransactions, transactionPage).map((txn, index) => (
  <tr
    key={`${txn.transaction_id}-${txn.reference_id}`}
    style={{ backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#ffffff" }}
  >
    <td>{txn.transaction_id}</td>
    <td>{txn.user_name}</td>
    <td>{txn.email}</td>
    <td>{txn.currency || "INR"} {txn.amount}</td>
    <td>{new Date(txn.date).toLocaleDateString()}</td>
    <td>{txn.payment_method}</td>
    <td>
      <span
        className={`badge rounded-pill ${
          txn.status?.toLowerCase() === "success"
            ? "bg-label-success"
            : txn.status?.toLowerCase() === "initiated"
            ? "bg-label-warning"
            : "bg-label-danger"
        }`}
      >
        {txn.status || "Unknown"}
      </span>
    </td>
    <td>{txn.reference_id}</td>
  </tr>
))}

              </tbody>
            </table>
          </div>

          {/* Pagination UI */}
          <div className="d-flex justify-content-center align-items-center p-3 gap-2">
            <button
              className="btn btn-sm btn-outline-primary"
              disabled={transactionPage === 1}
              onClick={() => setTransactionPage(transactionPage - 1)}
            >
              &lt;
            </button>
            <span className="fw-semibold">
              Page {transactionPage} of {totalTransactionPages}
            </span>
            <button
              className="btn btn-sm btn-outline-primary"
              disabled={transactionPage === totalTransactionPages}
              onClick={() => setTransactionPage(transactionPage + 1)}
            >
              &gt;
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="card mb-5">
          <div className="card-header d-flex justify-content-between flex-wrap gap-2 align-items-center">
            <h5 className="mb-0">User List with Transaction History</h5>
            <input
              type="text"
              className="form-control"
              placeholder="Search by name/email/mobile"
              style={{ maxWidth: 300 }}
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
            />
          </div>

          <div className="table-responsive text-nowrap">
            <table className="table table-striped">
              <thead>
                <tr>
                  {["name", "email", "mobile"].map((col) => (
                    <th
                      key={col}
                      onClick={() => {
                        if (userSortColumn === col) {
                          setUserSortOrder(
                            userSortOrder === "asc" ? "desc" : "asc"
                          );
                        } else {
                          setUserSortColumn(col);
                          setUserSortOrder("asc");
                        }
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      {col.toUpperCase()}{" "}
                      {userSortColumn === col
                        ? userSortOrder === "asc"
                          ? "▲"
                          : "▼"
                        : ""}
                    </th>
                  ))}
                  <th>Transactions</th>
                </tr>
              </thead>
              <tbody className="table-border-bottom-0">
               {paginate(sortedUsers, userPage).map((user, index) => (
  <tr
    key={`${user.user_id}-${user.email}`}
    style={{ backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#ffffff" }}
  >
    <td>{user.name}</td>
    <td>{user.email}</td>
    <td>{user.mobile}</td>
    <td>
      <button
        className="btn btn-outline-primary"
        onClick={() =>
          handleViewTransactions(user.user_id, user.name)
        }
      >
        View
      </button>
    </td>
  </tr>
))}

              </tbody>
            </table>
          </div>

          {/* Pagination UI */}
          <div className="d-flex justify-content-center align-items-center p-3 gap-2">
            <button
              className="btn btn-sm btn-outline-primary"
              disabled={userPage === 1}
              onClick={() => setUserPage(userPage - 1)}
            >
              &lt;
            </button>
            <span className="fw-semibold">
              Page {userPage} of {totalUserPages}
            </span>
            <button
              className="btn btn-sm btn-outline-primary"
              disabled={userPage === totalUserPages}
              onClick={() => setUserPage(userPage + 1)}
            >
              &gt;
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="modal fade show"
          style={{ display: "block" }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-xl" style={{ maxWidth: "90%" }}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Transactions for {selectedUser}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setIsModalOpen(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="d-flex justify-content-end mb-3">
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() =>
                      exportExcel(
                        userTransactions,
                        `${selectedUser}_transactions.xlsx`
                      )
                    }
                  >
                    Export Excel
                  </button>
                </div>

                {/* Deduplicate transactions */}
                {userTransactions.length > 0 ? (
                  (() => {
                    const seen = new Set();
                    const dedupedTxns = userTransactions.filter((txn) => {
                      if (seen.has(txn.transaction_id)) return false;
                      seen.add(txn.transaction_id);
                      return true;
                    });

                    const sortedTxns = [...dedupedTxns].sort((a, b) => {
                      if (!sortColumn) return 0;
                      const valA = a[sortColumn];
                      const valB = b[sortColumn];
                      if (typeof valA === "string") {
                        return sortOrder === "asc"
                          ? valA.localeCompare(valB)
                          : valB.localeCompare(valA);
                      }
                      return sortOrder === "asc" ? valA - valB : valB - valA;
                    });

                    return (
                      <>
                        <div className="table-responsive">
                          <table className="table table-bordered">
                            <thead>
                              <tr>
                                {[
                                  "transaction_id",
                                  "amount",
                                  "payment_date",
                                  "payment_method",
                                  "payment_status",
                                  "plan_name",
                                  "reference_id",
                                ].map((col) => (
                                  <th
                                    key={col}
                                    style={{ cursor: "pointer" }}
                                    onClick={() => {
                                      if (sortColumn === col) {
                                        setSortOrder((prev) =>
                                          prev === "asc" ? "desc" : "asc"
                                        );
                                      } else {
                                        setSortColumn(col);
                                        setSortOrder("asc");
                                      }
                                    }}
                                  >
                                    {col.replace(/_/g, " ").toUpperCase()}{" "}
                                    {sortColumn === col
                                      ? sortOrder === "asc"
                                        ? "▲"
                                        : "▼"
                                      : ""}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {paginate(sortedTxns, userTxnPage).map((txn) => (
                                <tr
                                  key={`${txn.transaction_id}-${txn.reference_id}`}
                                >
                                  <td>{txn.transaction_id}</td>
                                  <td>₹{txn.amount}</td>
                                  <td>
                                    {new Date(
                                      txn.payment_date
                                    ).toLocaleString()}
                                  </td>
                                  <td>{txn.payment_method}</td>
                                  <td>
                                    <span
                                      className={`badge rounded-pill ${
                                        txn.payment_status?.toLowerCase() ===
                                        "success"
                                          ? "bg-label-success"
                                          : txn.payment_status?.toLowerCase() ===
                                            "initiated"
                                          ? "bg-label-warning"
                                          : "bg-label-danger"
                                      }`}
                                    >
                                      {txn.payment_status || "Unknown"}
                                    </span>
                                  </td>
                                  <td>{txn.plan_name || "-"}</td>
                                  <td>{txn.reference_id || "-"}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {/* Centered Pagination UI */}
                        <div className="d-flex justify-content-center align-items-center mt-3 gap-2">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            disabled={userTxnPage === 1}
                            onClick={() => setUserTxnPage((prev) => prev - 1)}
                          >
                            &lt;
                          </button>
                          <span className="fw-semibold">
                            Page {userTxnPage} of{" "}
                            {Math.ceil(sortedTxns.length / ITEMS_PER_PAGE)}
                          </span>
                          <button
                            className="btn btn-sm btn-outline-primary"
                            disabled={
                              userTxnPage ===
                              Math.ceil(sortedTxns.length / ITEMS_PER_PAGE)
                            }
                            onClick={() => setUserTxnPage((prev) => prev + 1)}
                          >
                            &gt;
                          </button>
                        </div>
                      </>
                    );
                  })()
                ) : (
                  <p>No transactions found.</p>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsModalOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
