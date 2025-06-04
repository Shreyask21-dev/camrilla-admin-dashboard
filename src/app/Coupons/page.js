"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
<ToastContainer position="top-right" autoClose={3000} />;

export default function CouponsDashboard() {
  const currentYear = new Date().getFullYear();

  const [stats, setStats] = useState({
    used_coupons: 0,
    total_coupons: 0,
    total_discount_benefits: 0,
  });

  const [coupons, setCoupons] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [form, setForm] = useState({
    discount_coupon_code: "",
    discount_coupon_type: "PERCENTAGE",
    discount_value: "",
    start_date: "",
    end_date: "",
    active: 1,
    max_usage: 1,
    created_by: "admin",
    description: "",
    country: "IN",
    access: "public",
    marketer: "",
    allowed_users: "",
  });

  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  const filteredCoupons = coupons.filter((c) => {
    const keyword = searchTerm.toLowerCase();
    return (
      c.discount_coupon_code?.toLowerCase().includes(keyword) ||
      c.description?.toLowerCase().includes(keyword) ||
      c.marketer?.toLowerCase().includes(keyword)
    );
  });

  const sortedCoupons = [...filteredCoupons].sort((a, b) => {
    if (!sortColumn) return 0;

    let aVal = a[sortColumn];
    let bVal = b[sortColumn];

    if (sortColumn === "start_date" || sortColumn === "end_date") {
      aVal = new Date(aVal);
      bVal = new Date(bVal);
    }

    if (typeof aVal === "string") {
      return sortOrder === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }

    return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
  });

  useEffect(() => {
    fetchStats();
    fetchCoupons();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get("https://camrilla-admin-backend.onrender.com/api/coupons/stats");
      setStats(res.data);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
      toast.error("Failed to load stats.");
    }
  };

  const fetchCoupons = async () => {
    try {
      const res = await axios.get("https://camrilla-admin-backend.onrender.com/api/coupons");
      setCoupons(res.data);
    } catch (err) {
      console.error("Failed to fetch coupons:", err);
      toast.error("Failed to load coupons.");
    }
  };

  const formatDate = (msTimestamp) => {
    if (!msTimestamp) return "";
    const date = new Date(msTimestamp);
    return date.toISOString().split("T")[0]; // "YYYY-MM-DD"
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const openModal = (coupon = null) => {
    if (coupon) {
      setEditingCoupon(coupon);
      setForm({
        ...coupon,
        start_date: formatDate(coupon.start_date),
        end_date: formatDate(coupon.end_date),
      });
    } else {
      setEditingCoupon(null);
      setForm({
        discount_coupon_code: "",
        discount_coupon_type: "PERCENTAGE",
        discount_value: "",
        start_date: "",
        end_date: "",
        active: 1,
        max_usage: 1,
        created_by: "admin",
        description: "",
        country: "IN",
        access: "public",
        marketer: "",
        allowed_users: "",
      });
    }
    setShowModal(true);
  };

  const saveCoupon = async () => {
    try {
      const payload = {
        ...form,
        start_date: new Date(form.start_date).getTime(),
        end_date: new Date(form.end_date).getTime(),
      };

      if (editingCoupon) {
        console.log(new Date(form.start_date).getTime());

        await axios.put(
          `https://camrilla-admin-backend.onrender.com/api/coupons/${editingCoupon.id}`,
          payload
        );
        toast.success("Coupon updated successfully!");
      } else {
        await axios.post("https://camrilla-admin-backend.onrender.com/api/coupons", payload);
        toast.success("Coupon added successfully!");
      }

      setShowModal(false);
      fetchCoupons();
      fetchStats();
    } catch (err) {
      console.error("Failed to save coupon:", err);
      toast.error("Failed to save coupon.");
    }
  };

  const deleteCoupon = async (id) => {
    if (!confirm("Are you sure you want to delete this coupon?")) return;
    try {
      await axios.delete(`https://camrilla-admin-backend.onrender.com/api/coupons/${id}`);
      toast.success("Coupon deleted successfully!");
      fetchCoupons();
      fetchStats();
    } catch (err) {
      console.error("Failed to delete coupon:", err);
      toast.error("Failed to delete coupon.");
    }
  };

  return (
    <div className="content-wrapper">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="container-xxl flex-grow-1 container-p-y">
        <div className="row gy-6">
          <div className="col-12">
            <div className="card">
              <div className="card-body card-widget-separator">
                <div className="row gy-4 gy-sm-1">
                  {[
                    {
                      label: "Used Coupons",
                      value: stats.used_coupons,
                      icon: "ri-user-line",
                    },
                    {
                      label: "Coupons",
                      value: stats.total_coupons,
                      icon: "ri-pages-line",
                    },
                    {
                      label: "Discount Benefits",
                      value: `$${stats.total_discount_benefits}`,
                      icon: "ri-wallet-line",
                    },
                    {
                      label: "Unpaid",
                      value: "$0",
                      icon: "ri-money-dollar-circle-line",
                    },
                  ].map(({ value, label, icon }, idx) => (
                    <div className="col-sm-6 col-lg-3" key={idx}>
                      <div className="d-flex justify-content-between align-items-start border-end pb-4 pb-sm-0">
                        <div>
                          <h4 className="mb-0">{value}</h4>
                          <p className="mb-0">{label}</p>
                        </div>
                        <div className="avatar">
                          <span className="avatar-initial rounded-3 bg-label-secondary">
                            <i className={`${icon} text-heading ri-26px`}></i>
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="card mt-4">
            <div className="card-header px-4 pt-4">
              <div className="row w-100 align-items-center">
                <div className="col-md-6">
                  <h5 className="mb-0">Coupons List</h5>
                </div>
                <div className="col-md-6 d-flex justify-content-end align-items-center gap-2">
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="Search by code"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ maxWidth: 250, height: "38px" }}
                  />
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => openModal()}
                    style={{ height: "38px" }}
                  >
                    <i className="ri-add-line me-1"></i> Add Coupon
                  </button>
                </div>
              </div>
            </div>

            <div className="table-responsive text-nowrap">
              <table className="table table-striped">
                <thead>
                  <tr>
                    {[
                      { key: "discount_coupon_code", label: "Coupon Code" },
                      { key: "discount_value", label: "Discount" },
                      { key: "start_date", label: "Start" },
                      { key: "end_date", label: "End" },
                      { key: "status", label: "Status" },
                      { key: "max_usage", label: "Usage Limit" },
                      { key: "actions", label: "Actions" },
                    ].map((col) => (
                      <th
                        key={col.key}
                        onClick={() => {
                          if (col.key === "actions") return; // skip sort for actions
                          if (sortColumn === col.key) {
                            setSortOrder((prev) =>
                              prev === "asc" ? "desc" : "asc"
                            );
                          } else {
                            setSortColumn(col.key);
                            setSortOrder("asc");
                          }
                        }}
                        style={{
                          cursor: col.key === "actions" ? "default" : "pointer",
                        }}
                      >
                        {col.label}{" "}
                        {sortColumn === col.key
                          ? sortOrder === "asc"
                            ? "▲"
                            : "▼"
                          : ""}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="table-border-bottom-0">
                  {sortedCoupons.map((c, idx) => {
                    const currentDate = new Date();
                    const endDate = new Date(c.end_date);
                    const isExpired = endDate < currentDate;

                    return (
                      <tr key={idx}>
                        <td>{c.discount_coupon_code}</td>
                        <td>
                          {c.discount_coupon_type === "FLAT"
                            ? `₹${c.discount_value}`
                            : `${c.discount_value}%`}
                        </td>
                        <td>{new Date(c.start_date).toLocaleDateString()}</td>
                        <td>{new Date(c.end_date).toLocaleDateString()}</td>
                        <td>
                          <span
                            className={`badge bg-label-${
                              isExpired ? "danger" : "success"
                            }`}
                          >
                            {isExpired ? "Expired" : "Active"}
                          </span>
                        </td>
                        <td>{c.max_usage}</td>
                        <td>
                          <button
                            className="btn btn-sm text-primary me-2"
                            onClick={() => openModal(c)}
                          >
                            <i className="ri-pencil-line"></i>
                          </button>
                          <button
                            className="btn btn-sm text-danger"
                            onClick={() => deleteCoupon(c.id)}
                          >
                            <i className="ri-delete-bin-7-line"></i>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingCoupon ? "Edit Coupon" : "Add Coupon"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            name="discount_coupon_code"
            className="form-control mb-2"
            placeholder="Coupon Code"
            value={form.discount_coupon_code}
            onChange={handleChange}
          />
          <input
            name="discount_value"
            className="form-control mb-2"
            placeholder="Discount Value"
            value={form.discount_value}
            onChange={handleChange}
          />
          <select
            name="discount_coupon_type"
            className="form-control mb-2"
            value={form.discount_coupon_type}
            onChange={handleChange}
          >
            <option value="PERCENTAGE">PERCENTAGE</option>
            <option value="FLAT">FLAT</option>
          </select>
          <input
            name="start_date"
            type="date"
            className="form-control mb-2"
            value={form.start_date}
            onChange={handleChange}
          />
          <input
            name="end_date"
            type="date"
            className="form-control mb-2"
            value={form.end_date}
            onChange={handleChange}
          />
          <select
            name="active"
            className="form-control mb-2"
            value={form.active}
            onChange={handleChange}
          >
            <option value={1}>Active</option>
            <option value={0}>Inactive</option>
          </select>
          <input
            name="max_usage"
            className="form-control mb-2"
            placeholder="Max Usage"
            value={form.max_usage}
            onChange={handleChange}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={saveCoupon}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Footer */}
      <footer className="content-footer footer bg-footer-theme mt-4">
        <div className="container-xxl">
          <div className="footer-container d-flex align-items-center justify-content-between py-4 flex-md-row flex-column">
            <div className="text-body mb-2 mb-md-0">
              © {currentYear}, made with{" "}
              <span className="text-danger">
                <i className="tf-icons ri-heart-fill"></i>
              </span>{" "}
              by
              <a
                href="https://pixinvent.com"
                target="_blank"
                className="footer-link"
                rel="noopener noreferrer"
              >
                {" "}
                Pixinvent
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
