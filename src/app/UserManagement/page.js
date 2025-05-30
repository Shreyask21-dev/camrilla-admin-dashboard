"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Page() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    total_users: 0,
    professional_users: 0,
    basic_users: 0,
    active_users: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const usersPerPage = 10;
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, []);

  const fetchUsers = () => {
    axios
      .get("http://localhost:4000/api/user_details")
      .then((res) => setUsers(res.data))
      .catch(() => toast.error("Failed to load user data"));
  };

  const fetchStats = () => {
    axios
      .get("http://localhost:4000/api/user-stats")
      .then((res) => setStats(res.data))
      .catch(() => toast.error("Failed to load user stats"));
  };

  const formatDate = (dateStr) =>
    dateStr ? new Date(dateStr).toISOString().split("T")[0] : "—";

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedUsers = [...users].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const valA = String(a[sortConfig.key] ?? "");
    const valB = String(b[sortConfig.key] ?? "");
    return sortConfig.direction === "asc"
      ? valA.localeCompare(valB)
      : valB.localeCompare(valA);
  });

  const filteredUsers = sortedUsers.filter((user) =>
    [user.name, user.email, user.current_plan]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handleDelete = async (userId) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`http://localhost:4000/api/delete_user/${userId}`);
      toast.success("User deleted successfully");
      fetchUsers();
      fetchStats(); // update stats after deletion
    } catch {
      toast.error("Failed to delete user");
    }
  };

  const handleEdit = async (user) => {
    const newName = prompt("Enter new name:", user.name);
    if (!newName || newName === user.name) return;
    try {
      await axios.put(`http://localhost:4000/api/update_user/${user.user_id}`, {
        name: newName,
      });
      toast.success("User updated successfully");
      fetchUsers();
      fetchStats(); // update stats after edit if necessary
    } catch {
      toast.error("Failed to update user");
    }
  };

  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="content-wrapper">
        <div className="container-xxl flex-grow-1 container-p-y">
          <div className="row gy-6">
            {/* Dynamic Stats Cards */}
            <div className="col-sm-6 col-lg-3">
              <div className="card card-border-shadow-primary h-100">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-2">
                    <div className="avatar me-4">
                      <span className="avatar-initial rounded-3 bg-label-primary">
                        <i className="ri-user-line ri-24px"></i>
                      </span>
                    </div>
                    <h4 className="mb-0">{stats.total_users}</h4>
                  </div>
                  <h6 className="mb-0 fw-normal">Total Users</h6>
                  <p className="mb-0">
                    <span className="me-1 fw-medium">+18.2%</span>
                    {/* <!-- <small className="text-muted">than last week</small> --> */}
                  </p>
                </div>
              </div>
            </div>

            <div className="col-sm-6 col-lg-3">
              <div className="card card-border-shadow-warning h-100">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-2">
                    <div className="avatar me-4">
                      <span className="avatar-initial rounded-3 bg-label-warning">
                        <i className="ri-alert-line ri-24px"></i>
                      </span>
                    </div>
                    <h4 className="mb-0">{stats.professional_users}</h4>
                  </div>
                  <h6 className="mb-0 fw-normal">Professional Users</h6>
                  <p className="mb-0">
                    <span className="me-1 fw-medium">-8.7%</span>
                    <small className="text-muted">than last week</small>
                  </p>
                </div>
              </div>
            </div>

            <div className="col-sm-6 col-lg-3">
              <div className="card card-border-shadow-danger h-100">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-2">
                    <div className="avatar me-4">
                      <span className="avatar-initial rounded-3 bg-label-danger">
                        <i className="ri-route-line ri-24px"></i>
                      </span>
                    </div>
                    <h4 className="mb-0">{stats.active_users}</h4>
                  </div>
                  <h6 className="mb-0 fw-normal">Active Users</h6>
                  <p className="mb-0">
                    <span className="me-1 fw-medium">+4.3%</span>
                    <small className="text-muted">than last week</small>
                  </p>
                </div>
              </div>
            </div>

            <div className="col-sm-6 col-lg-3">
              <div className="card card-border-shadow-info h-100">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-2">
                    <div className="avatar me-4">
                      <span className="avatar-initial rounded-3 bg-label-info">
                        <i className="ri-time-line ri-24px"></i>
                      </span>
                    </div>
                    <h4 className="mb-0">{stats.basic_users}</h4>
                  </div>
                  <h6 className="mb-0 fw-normal">Basic Users</h6>
                  <p className="mb-0">
                    <span className="me-1 fw-medium">-2.5%</span>
                    <small className="text-muted">than last week</small>
                  </p>
                </div>
              </div>
            </div>

            {/* User Management Table (unchanged) */}
            <div className="card">
              <h5 className="card-header d-flex justify-content-between align-items-center">
                {/* <span>User Management</span> */}
                <input
                  type="text"
                  placeholder="Search by name, email, or plan"
                  className="form-control w-auto"
                  style={{ maxWidth: "250px" }}
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </h5>

              <span className="small text-muted">
                Page {currentPage} of {totalPages}
              </span>

              <div className="table-responsive text-nowrap">
                <table className="table">
                  <thead>
                    <tr>
                      {[
                        "user_id",
                        "name",
                        "email",
                        "mobile",
                        "country",
                        "current_plan",
                        "plan_start_date",
                        "plan_end_date",
                        "total_assignment_count",
                        "total_leads_count",
                        "payment_status",
                      ].map((key) => (
                        <th
                          key={key}
                          onClick={() => handleSort(key)}
                          style={{ cursor: "pointer" }}
                        >
                          {key.replace(/_/g, " ").toUpperCase()}
                          {sortConfig.key === key &&
                            (sortConfig.direction === "asc" ? " ▲" : " ▼")}
                        </th>
                      ))}
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody className="table-border-bottom-0">
                    {currentUsers.map((user, index) => (
                      <tr key={index}>
                        <td>{user.user_id}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.mobile}</td>
                        <td>{user.country}</td>
                        <td>{user.current_plan || "—"}</td>
                        <td>{formatDate(user.plan_start_date)}</td>
                        <td>{formatDate(user.plan_end_date)}</td>
                        <td>{user.total_assignment_count}</td>
                        <td>{user.total_leads_count}</td>
                        <td>{user.payment_status || "—"}</td>
                        <td>
                          <div className="dropdown">
                            <button
                              type="button"
                              className="btn p-0 dropdown-toggle hide-arrow"
                              data-bs-toggle="dropdown"
                            >
                              <i className="ri-more-2-line"></i>
                            </button>
                            <div className="dropdown-menu">
                              <button
                                className="dropdown-item"
                                onClick={() => handleEdit(user)}
                              >
                                <i className="ri-pencil-line me-1"></i> Edit
                              </button>
                              <button
                                className="dropdown-item"
                                onClick={() => handleDelete(user.user_id)}
                              >
                                <i className="ri-delete-bin-7-line me-1"></i>{" "}
                                Delete
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="d-flex justify-content-between align-items-center p-3">
                <button
                  className="btn btn-outline-primary"
                  onClick={goToPrevPage}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <span>
                  Showing {indexOfFirstUser + 1}–
                  {Math.min(indexOfLastUser, filteredUsers.length)} of{" "}
                  {filteredUsers.length}
                </span>
                <button
                  className="btn btn-outline-primary"
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
