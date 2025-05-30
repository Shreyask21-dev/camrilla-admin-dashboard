"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BarChart from "./Barchart";
import LineChart from "./Linechart";

export default function Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");

    // if (!token) {
    //   router.push("/AdminLogin");
    //   return;
    // }

    // fetch("http://localhost:4000/api/admin/dashboard", {
    //   headers: {
    //     Authorization: `Bearer ${token}`,
    //   },
    // })
    //   .then((res) => {
    //     if (!res.ok) throw new Error("Unauthorized");
    //     return res.json();
    //   })
    //   .then(() => setLoading(false))
    //   .catch(() => {
    //     localStorage.removeItem("adminToken");
    //     router.push("/AdminLogin");
    //   });
  }, []);

  // if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="content-wrapper">
        <div className="container-xxl flex-grow-1 container-p-y">
          {/* LOGOUT BUTTON */}
          <div className="d-flex justify-content-end mb-3">
            <button
              className="btn btn-outline-danger"
              onClick={() => {
                localStorage.removeItem("adminToken");
                router.push("/admin/login");
              }}
            >
              Logout
            </button>
          </div>

          <div className="row g-6 mb-6">
            {/* Revenue Card */}
            <div className="col-lg-6">
              <div className="card h-100">
                <div className="card-header">
                  <div className="d-flex justify-content-between">
                    <h5 className="mb-1">Revenue</h5>
                    <div className="dropdown">
                      <button
                        className="btn btn-text-secondary rounded-pill text-muted border-0 p-1"
                        type="button"
                        data-bs-toggle="dropdown"
                      >
                        <i className="ri-more-2-line ri-20px"></i>
                      </button>
                      <div className="dropdown-menu dropdown-menu-end">
                        <a className="dropdown-item" href="#">Refresh</a>
                        <a className="dropdown-item" href="#">Share</a>
                        <a className="dropdown-item" href="#">Update</a>
                      </div>
                    </div>
                  </div>
                  <div className="d-flex align-items-center card-subtitle">
                    <div className="me-2">Total 425k Revenue</div>
                    <div className="d-flex align-items-center text-success">
                      <p className="mb-0 fw-medium">+18%</p>
                      <i className="ri-arrow-up-s-line ri-20px"></i>
                    </div>
                  </div>
                </div>
                <div className="card-body d-flex justify-content-between flex-wrap gap-4">
                  <div className="d-flex align-items-center gap-3">
                    <div className="avatar">
                      <div className="avatar-initial bg-label-primary rounded">
                        <i className="ri-user-star-line ri-24px"></i>
                      </div>
                    </div>
                    <div className="card-info">
                      <h5 className="mb-0">81</h5>
                      <p className="mb-0">Active Coupons</p>
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-3">
                    <div className="avatar">
                      <div className="avatar-initial bg-label-warning rounded">
                        <i className="ri-pie-chart-2-line ri-24px"></i>
                      </div>
                    </div>
                    <div className="card-info">
                      <h5 className="mb-0">285034</h5>
                      <p className="mb-0">Total Profit</p>
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-3">
                    <div className="avatar">
                      <div className="avatar-initial bg-label-info rounded">
                        <i className="ri-arrow-left-right-line ri-24px"></i>
                      </div>
                    </div>
                    <div className="card-info">
                      <h5 className="mb-0">2,4500</h5>
                      <p className="mb-0">New Transactions</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Ratings, Sessions, and More Cards... (unchanged sections) */}
            {/* Paste the rest of your original JSX structure here as-is */}
            {/* The rest of your UI (graphs, cards, charts) stays the same */}

            {/* Yearly Revenue Chart */}
            <div className="col-xl-12 col-12">
              <div className="card">
                <div className="card-header header-elements">
                  <h5 className="card-title mb-0">Yearly Revenue</h5>
                </div>
                <div className="card-body">
                  <BarChart />
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="content-footer footer bg-footer-theme">
            <div className="container-xxl">
              <div className="footer-container d-flex align-items-center justify-content-between py-4 flex-md-row flex-column">
                <div className="text-body mb-2 mb-md-0">
                  ©{new Date().getFullYear()}, made with{" "}
                  <span className="text-danger">
                    <i className="tf-icons ri-heart-fill"></i>
                  </span>{" "}
                  by{" "}
                  <a
                    href="https://pixinvent.com"
                    target="_blank"
                    className="footer-link"
                  >
                    Pixinvent
                  </a>
                </div>
                <div className="d-none d-lg-inline-block">
                  <a
                    href="https://themeforest.net/licenses/standard"
                    className="footer-link me-4"
                    target="_blank"
                  >
                    License
                  </a>
                  <a
                    href="https://1.envato.market/pixinvent_portfolio"
                    target="_blank"
                    className="footer-link me-4"
                  >
                    More Themes
                  </a>
                  <a
                    href="https://demos.pixinvent.com/materialize-html-admin-template/documentation/"
                    target="_blank"
                    className="footer-link me-4"
                  >
                    Documentation
                  </a>
                  <a
                    href="https://pixinvent.ticksy.com/"
                    target="_blank"
                    className="footer-link d-none d-sm-inline-block"
                  >
                    Support
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
