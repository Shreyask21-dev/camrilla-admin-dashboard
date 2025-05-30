"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function PlansPage() {
  const [plans, setPlans] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "plan_id", direction: "asc" });
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    plan_id: null,
    country: "",
    currency: "",
    plan_name: "",
    plan_description: "",
    final_amount: ""
  });

  const plansPerPage = 10;

  useEffect(() => {
    fetchPlans();
    fetchAnalytics();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/plan");
      setPlans(res.data);
    } catch (err) {
      toast.error("Error fetching plans");
    }
  };

  const fetchAnalytics = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/dashboard-stats");
      setAnalytics(res.data);
    } catch (err) {
      toast.error("Error fetching analytics");
    }
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
    setCurrentPage(1);
  };

  const sortedPlans = [...plans].filter(plan =>
    plan.plan_name.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === "asc" ? -1 : 1;
    if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const currentPlans = sortedPlans.slice((currentPage - 1) * plansPerPage, currentPage * plansPerPage);
  const totalPages = Math.ceil(sortedPlans.length / plansPerPage);

  const handleAddEdit = () => {
    if (!formData.country || !formData.currency || !formData.plan_name || !formData.final_amount) {
      toast.error("Please fill all required fields");
      return;
    }

    const endpoint = formData.plan_id
      ? `http://localhost:4000/api/plan/${formData.plan_id}`
      : "http://localhost:4000/api/plan";
    const method = formData.plan_id ? "put" : "post";

    axios[method](endpoint, formData)
      .then(() => {
        toast.success(`Plan ${formData.plan_id ? "updated" : "added"} successfully`);
        fetchPlans();
        setModalVisible(false);
        setFormData({
          plan_id: null,
          country: "",
          currency: "",
          plan_name: "",
          plan_description: "",
          final_amount: ""
        });
      })
      .catch(() => toast.error("Failed to save plan"));
  };

  const handleEdit = (plan) => {
    setFormData(plan);
    setModalVisible(true);
  };

  const handleDelete = (plan_id) => {
    if (!confirm("Are you sure to delete this plan?")) return;
    axios.delete(`http://localhost:4000/api/plan/${plan_id}`)
      .then(() => {
        toast.success("Plan deleted");
        fetchPlans();
      })
      .catch(() => toast.error("Failed to delete plan"));
  };

  return (
    <div className="content-wrapper">
      <ToastContainer />
      <div className="container-xxl flex-grow-1 container-p-y">
        <div className="row g-4">
          <StatCard icon="ri-car-line" label="Country Total" count={analytics.total_country_count || 0} color="primary" trend="+18.2%" />
          <StatCard icon="ri-alert-line" label="Total Plans" count={analytics.total_plans || 0} color="warning" trend="-8.7%" />
          <StatCard icon="ri-route-line" label="Most Used Plan" count={analytics.most_used_plan?.user_count || 0} color="danger" trend="+4.3%" />
          <StatCard icon="ri-time-line" label={analytics.most_used_plan?.plan_name || "N/A"} count="" color="info" trend="-2.5%" />
        </div>

        <div className="card mt-4">
          <div className="pb-4 rounded-top">
            <div className="container py-4 d-flex justify-content-between">
              <input
                type="text"
                className="form-control w-50"
                placeholder="Search by plan name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="btn btn-primary" onClick={() => setModalVisible(true)}>Add Plan</button>
            </div>

            <h4 className="text-center mb-2">Plans Management</h4>
            <div className="table-responsive text-nowrap">
              <table className="table table-striped">
                <thead>
                  <tr>
                    {["plan_id", "country", "currency", "plan_name", "plan_description", "final_amount"].map(key => (
                      <th key={key} style={{ cursor: "pointer" }} onClick={() => handleSort(key)}>
                        {key.replace(/_/g, " ").toUpperCase()} {sortConfig.key === key && (sortConfig.direction === "asc" ? "▲" : "▼")}
                      </th>
                    ))}
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentPlans.map((plan) => (
                    <tr key={plan.plan_id}>
                      <td>{plan.plan_id}</td>
                      <td>{plan.country}</td>
                      <td>{plan.currency}</td>
                      <td>{plan.plan_name}</td>
                      <td>{plan.plan_description}</td>
                      <td>{plan.final_amount}</td>
                      <td>
                        <button className="btn btn-outline-primary btn-sm me-1" onClick={() => handleEdit(plan)}>Edit</button>
                        <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(plan.plan_id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                  {currentPlans.length === 0 && <tr><td colSpan="8" className="text-center">No plans found.</td></tr>}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="d-flex justify-content-center mt-3 gap-2">
                <button className="btn btn-sm btn-outline-primary" disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)}>&lt;</button>
                <span>Page {currentPage} of {totalPages}</span>
                <button className="btn btn-sm btn-outline-primary" disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)}>&gt;</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
     {modalVisible && (
  <div className="modal d-block bg-dark bg-opacity-50" tabIndex="-1">
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content p-4 rounded shadow-sm">
        <h5 className="modal-title mb-3 text-center fw-bold">
          {formData.plan_id ? "Edit Plan" : "Add Plan"}
        </h5>

        {/* Country */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Country</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter country code (e.g. IN, US)"
            value={formData.country}
            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
          />
          {!formData.country && <small className="text-danger">Country is required</small>}
        </div>

        {/* Currency */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Currency</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter currency code (e.g. INR, USD)"
            value={formData.currency}
            onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
          />
          {!formData.currency && <small className="text-danger">Currency is required</small>}
        </div>

        {/* Plan Name */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Plan Name</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter plan name"
            value={formData.plan_name}
            onChange={(e) => setFormData({ ...formData, plan_name: e.target.value })}
          />
          {!formData.plan_name && <small className="text-danger">Plan name is required</small>}
        </div>

        {/* Plan Description */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Plan Description</label>
          <textarea
            className="form-control"
            placeholder="Enter plan description (optional)"
            rows="3"
            value={formData.plan_description}
            onChange={(e) => setFormData({ ...formData, plan_description: e.target.value })}
          ></textarea>
        </div>

        {/* Final Amount */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Final Amount</label>
          <input
            type="number"
            className="form-control"
            placeholder="Enter amount (e.g. 499)"
            value={formData.final_amount}
            onChange={(e) => setFormData({ ...formData, final_amount: e.target.value })}
          />
          {!formData.final_amount && <small className="text-danger">Amount is required</small>}
        </div>

        {/* Action Buttons */}
        <div className="d-flex justify-content-end mt-3">
          <button className="btn btn-secondary me-2" onClick={() => setModalVisible(false)}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={handleAddEdit}
            disabled={
              !formData.country ||
              !formData.currency ||
              !formData.plan_name ||
              !formData.final_amount
            }
          >
            {formData.plan_id ? "Update" : "Add"}
          </button>
        </div>
      </div>
    </div>
  </div>
)}

    </div>
  );
}

function StatCard({ icon, label, count, color, trend }) {
  return (
    <div className="col-sm-6 col-lg-3">
      <div className={`card card-border-shadow-${color} h-100`}>
        <div className="card-body">
          <div className="d-flex align-items-center mb-2">
            <div className="avatar me-4">
              <span className={`avatar-initial rounded-3 bg-label-${color}`}>
                <i className={`${icon} ri-24px`}></i>
              </span>
            </div>
            <h4 className="mb-0">{count}</h4>
          </div>
          <h6 className="mb-0 fw-normal">{label}</h6>
          <p className="mb-0">
            <span className="me-1 fw-medium">{trend}</span>
            <small className="text-muted">than last week</small>
          </p>
        </div>
      </div>
    </div>
  );
}
