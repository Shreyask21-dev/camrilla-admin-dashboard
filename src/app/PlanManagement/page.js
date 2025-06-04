"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function PlansPage() {
  const [plans, setPlans] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "plan_id",
    direction: "asc",
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    plan_id: null,
    country: "",
    currency: "",
    plan_name: "",
    plan_description: "",
    final_amount: "",
    monthly_amount: "",
    feature: "",
    monthly_disscounted_amount: "",
    feature: [],
  });
  useEffect(() => {
    console.log("Current formData:", formData);
  }, [formData]);

  const plansPerPage = 10;

  useEffect(() => {
    fetchPlans();
    fetchAnalytics();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await axios.get("https://camrilla-admin-backend.onrender.com/api/plan");
      setPlans(res.data);
    } catch (err) {
      toast.error("Error fetching plans");
    }
  };
  const handleExportExcel = () => {
    try {
      if (!plans || plans.length === 0) {
        toast.warning("No data available to export.");
        return;
      }

      const worksheet = XLSX.utils.json_to_sheet(plans);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Plans");

      // Set dynamic column widths
      const cols = Object.keys(plans[0]).map((key) => ({
        wch:
          Math.max(
            key.length,
            ...plans.map((row) => (row[key] ? row[key].toString().length : 0))
          ) + 2,
      }));
      worksheet["!cols"] = cols;

      // Set dynamic file name based on first country value
      const firstCountry = plans[0]?.country || "all";
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const fileName = `plans_export_${firstCountry}_${timestamp}.xlsx`;

      XLSX.writeFile(workbook, fileName);
      toast.success("Plans exported successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to export plans.");
    }
  };

  const fetchAnalytics = async () => {
    try {
      const res = await axios.get("https://camrilla-admin-backend.onrender.com/api/dashboard-stats");
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

  const sortedPlans = [...plans]
    .filter((plan) =>
      plan.plan_name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key])
        return sortConfig.direction === "asc" ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key])
        return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

  const currentPlans = sortedPlans.slice(
    (currentPage - 1) * plansPerPage,
    currentPage * plansPerPage
  );
  const totalPages = Math.ceil(sortedPlans.length / plansPerPage);

  const handleAddEdit = () => {
    console.log("Submitting formData:", formData);

    if (
      !formData.country ||
      !formData.currency ||
      !formData.plan_name ||
      !formData.final_amount
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    const endpoint = formData.plan_id
      ? `https://camrilla-admin-backend.onrender.com/api/plan/${formData.plan_id}`
      : "https://camrilla-admin-backend.onrender.com/api/plan";
    const method = formData.plan_id ? "put" : "post";

    axios[method](endpoint, formData)
      .then(() => {
        toast.success(
          `Plan ${formData.plan_id ? "updated" : "added"} successfully`
        );
        fetchPlans();
        setModalVisible(false);
        resetFormData();
      })
      .catch(() => toast.error("Failed to save plan"));
  };

  const handleEdit = (plan) => {
    console.log("Submitting formData:", formData);

    setFormData(plan);
    setModalVisible(true);
  };

  const handleDelete = (plan_id) => {
    if (!confirm("Are you sure to delete this plan?")) return;
    axios
      .delete(`https://camrilla-admin-backend.onrender.com/api/plan/${plan_id}`)
      .then(() => {
        toast.success("Plan deleted");
        fetchPlans();
      })
      .catch(() => toast.error("Failed to delete plan"));
  };
  const resetFormData = () => {
    setFormData({
      plan_id: null,
      country: "",
      currency: "",
      plan_name: "",
      plan_description: "",
      final_amount: "",
      monthly_amount: "",
      feature: [],
      monthly_disscounted_amount: "",
    });
  };

  return (
    <div className="content-wrapper">
      <ToastContainer />
      <div className="container-xxl flex-grow-1 container-p-y">
        <div className="row g-4">
          <StatCard
            icon="ri-car-line"
            label="Country Total"
            count={analytics.total_country_count || 0}
            color="primary"
            trend="+18.2%"
          />
          <StatCard
            icon="ri-alert-line"
            label="Total Plans"
            count={analytics.total_plans || 0}
            color="warning"
            trend="-8.7%"
          />
          <StatCard
            icon="ri-route-line"
            label="Most Used Plan"
            count={analytics.most_used_plan?.user_count || 0}
            color="danger"
            trend="+4.3%"
          />
          <StatCard
            icon="ri-time-line"
            label={analytics.most_used_plan?.plan_name || "N/A"}
            count=""
            color="info"
            trend="-2.5%"
          />
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
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "10px",
                }}
              >
                <button
                  className="btn btn-primary"
                  onClick={() => setModalVisible(true)}
                >
                  Add Plan
                </button>
                <button onClick={handleExportExcel} className="btn btn-primary">
                  Export Excel
                </button>
              </div>
            </div>

            <h4 className="text-center mb-2">Plans Management</h4>
            <div className="table-responsive text-nowrap">
              <table className="table table-striped">
                <thead>
                  <tr>
                    {[
                      "plan_id",
                      "country",
                      "currency",
                      "plan_name",
                      "plan_description",
                      "monthly_amount",
                      "monthly_disscounted_amount",
                      "final_amount",
                      "feature",
                    ].map((key) => (
                      <th
                        key={key}
                        style={{ cursor: "pointer" }}
                        onClick={() => handleSort(key)}
                      >
                        {key.replace(/_/g, " ").toUpperCase()}{" "}
                        {sortConfig.key === key &&
                          (sortConfig.direction === "asc" ? "▲" : "▼")}
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
                      <td>{plan.monthly_amount}</td>
                      <td>{plan.monthly_disscounted_amount}</td>
                      <td>{plan.final_amount}</td>
                      <td>
                        <ul className="mb-0 ps-3">
                          {(Array.isArray(plan.feature)
                            ? plan.feature
                            : JSON.parse(plan.feature || "[]")
                          ).map((feat, index) => (
                            <li key={index}>{feat}</li>
                          ))}
                        </ul>
                      </td>

                      <td>
                        <button
                          className="btn btn-outline-primary btn-sm me-1"
                          onClick={() => handleEdit(plan)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleDelete(plan.plan_id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {currentPlans.length === 0 && (
                    <tr>
                      <td colSpan="8" className="text-center">
                        No plans found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="d-flex justify-content-center mt-3 gap-2">
                <button
                  className="btn btn-sm btn-outline-primary"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                >
                  &lt;
                </button>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  className="btn btn-sm btn-outline-primary"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                >
                  &gt;
                </button>
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
                  onChange={(e) =>
                    setFormData({ ...formData, country: e.target.value })
                  }
                />
                {!formData.country && (
                  <small className="text-danger">Country is required</small>
                )}
              </div>

              {/* Currency */}
              <div className="mb-3">
                <label className="form-label fw-semibold">Currency</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter currency code (e.g. INR, USD)"
                  value={formData.currency}
                  onChange={(e) =>
                    setFormData({ ...formData, currency: e.target.value })
                  }
                />
                {!formData.currency && (
                  <small className="text-danger">Currency is required</small>
                )}
              </div>

              {/* Plan Name */}
              <div className="mb-3">
                <label className="form-label fw-semibold">Plan Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter plan name"
                  value={formData.plan_name}
                  onChange={(e) =>
                    setFormData({ ...formData, plan_name: e.target.value })
                  }
                />
                {!formData.plan_name && (
                  <small className="text-danger">Plan name is required</small>
                )}
              </div>

              {/* Plan Description */}
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Plan Description
                </label>
                <textarea
                  className="form-control"
                  placeholder="Enter plan description (optional)"
                  rows="3"
                  value={formData.plan_description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      plan_description: e.target.value,
                    })
                  }
                ></textarea>
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Monthly Amount</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Enter monthly amount (e.g. 99)"
                  value={formData.monthly_amount}
                  onChange={(e) =>
                    setFormData({ ...formData, monthly_amount: e.target.value })
                  }
                />
                {!formData.monthly_amount && (
                  <small className="text-danger">
                    Monthly amount is required
                  </small>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Monthly Discounted Amount
                </label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Enter discounted amount (e.g. 79)"
                  value={formData.monthly_disscounted_amount}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      monthly_discounted_amount: e.target.value,
                    })
                  }
                />
                {!formData.monthly_disscounted_amount && (
                  <small className="text-danger">
                    Discounted amount is required
                  </small>
                )}
              </div>

              {/* Final Amount */}
              <div className="mb-3">
                <label className="form-label fw-semibold">Final Amount</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Enter amount (e.g. 499)"
                  value={formData.final_amount}
                  onChange={(e) =>
                    setFormData({ ...formData, final_amount: e.target.value })
                  }
                />
                {!formData.final_amount && (
                  <small className="text-danger">Amount is required</small>
                )}
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Features</label>
                {Array.isArray(formData?.feature)
                  ? formData.feature.map((feat, index) => (
                      <div key={index} className="d-flex gap-2 mb-2">
                        <input
                          type="text"
                          className="form-control"
                          placeholder={`Feature ${index + 1}`}
                          value={feat}
                          onChange={(e) => {
                            const updated = [...formData.feature];
                            updated[index] = e.target.value;
                            setFormData({ ...formData, feature: updated });
                          }}
                        />
                        <button
                          className="btn btn-outline-danger"
                          onClick={() => {
                            const updated = [...formData.feature];
                            updated.splice(index, 1);
                            setFormData({ ...formData, feature: updated });
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    ))
                  : null}
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      feature: [...formData.feature, ""],
                    })
                  }
                >
                  + Add Feature
                </button>
                {(formData?.feature?.length ?? 0) === 0 && (
                  <small className="text-danger d-block mt-1">
                    At least one feature is required
                  </small>
                )}
              </div>

              {/* Action Buttons */}
              <div className="d-flex justify-content-end mt-3">
                <button
                  className="btn btn-secondary me-2"
                  onClick={() => {
                    setModalVisible(false);
                    resetFormData();
                  }}
                >
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
          <h6 className="mb-0 fw-bold">{label}</h6>
          <p className="mb-0">
            {/* <span className="me-1 fw-medium">{trend}</span> */}
            {/* <small className="text-muted">than last week</small> */}
          </p>
        </div>
      </div>
    </div>
  );
}
