"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Page() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalCoupons, setTotalCoupons] = useState(0);
  const [newTransactions, setNewTransactions] = useState(0);
  const [successTransactionCount, setSuccessTransactionCount] = useState(0); // Total success transactions (all time)
  const [totalProfit, setTotalProfit] = useState(0); // Sum of
  const [assignmentCount, setAssignmentCount] = useState(0);
  const [leadCount, setLeadCount] = useState(0);

  useEffect(() => {
    fetch("https://camrilla-admin-backend.onrender.com/api/stats-count")
      .then((res) => res.json())
      .then((data) => {
        setAssignmentCount(data.assignment_count || 0);
        setLeadCount(data.lead_count || 0);
      })
      .catch((err) => console.error("Failed to load stats:", err));
  }, []);

  useEffect(() => {
    axios
      .get("https://camrilla-admin-backend.onrender.com/api/feedback")
      .then((res) => setFeedbacks(res.data))
      .catch((err) => console.error("Failed to load feedbacks:", err));
  }, []);
  const filteredFeedbacks = feedbacks.filter(
    (fb) =>
      fb.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fb.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  useEffect(() => {
    fetch("https://camrilla-admin-backend.onrender.com/api/coupons/stats")
      .then((res) => res.json())
      .then((data) => {
        setTotalCoupons(data.total_coupons);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    fetch("https://camrilla-admin-backend.onrender.com/api/transactions")
      .then((res) => res.json())
      .then((transactions) => {
        if (!Array.isArray(transactions)) return;

        // ✅ Filter only successful transactions
        const successTransactions = transactions.filter(
          (t) => t.status === "success"
        );

        // ✅ Total number of successful transactions (across all years)
        setSuccessTransactionCount(successTransactions.length);

        // ✅ Sum of all successful transaction amounts (Total Profit)
        const totalProfit = successTransactions.reduce((sum, t) => {
          const amount = parseFloat(t.amount);
          return !isNaN(amount) ? sum + amount : sum;
        }, 0);
        setTotalProfit(totalProfit);

        // ✅ Count new transactions from latest month
        if (successTransactions.length === 0) {
          setNewTransactions(0);
          return;
        }

        const latestDate = successTransactions.reduce((latest, t) => {
          const tDate = new Date(t.date);
          return tDate > latest ? tDate : latest;
        }, new Date(0));

        const latestYear = latestDate.getFullYear();
        const latestMonth = latestDate.getMonth();

        const latestMonthTransactions = successTransactions.filter((t) => {
          const tDate = new Date(t.date);
          return (
            tDate.getFullYear() === latestYear &&
            tDate.getMonth() === latestMonth
          );
        });

        setNewTransactions(latestMonthTransactions.length);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <div className="content-wrapper">
        {/* <!-- Content --> */}

        <div className="container-xxl flex-grow-1 container-p-y">
          <div className="row g-6 mb-6">
            {/* /                            <!-- Sales Overview--> */}
            <div className="col-lg-6">
              <div className="card h-100">
                <div className="card-header">
                  <div className="d-flex justify-content-between">
                    <h5 className="mb-1">Revenue</h5>
                    <div className="dropdown">
                      <button
                        className="btn btn-text-secondary rounded-pill text-muted border-0 p-1"
                        type="button"
                        id="salesOverview"
                        data-bs-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        <i className="ri-more-2-line ri-20px"></i>
                      </button>
                      <div
                        className="dropdown-menu dropdown-menu-end"
                        aria-labelledby="salesOverview"
                      >
                        <a className="dropdown-item" href="javascript:void(0);">
                          Refresh
                        </a>
                        <a className="dropdown-item" href="javascript:void(0);">
                          Share
                        </a>
                        <a className="dropdown-item" href="javascript:void(0);">
                          Update
                        </a>
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
                      <h5 className="mb-0">{totalCoupons}</h5>

                      <p className="mb-0">Total Coupons</p>
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-3">
                    <div className="avatar">
                      <div className="avatar-initial bg-label-warning rounded">
                        <i className="ri-pie-chart-2-line ri-24px"></i>
                      </div>
                    </div>
                    <div className="card-info">
                      <h5 className="mb-0">₹{totalProfit.toLocaleString()}</h5>

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
                      <h5 className="mb-0">
                        {newTransactions.toLocaleString()}
                      </h5>

                      <p className="mb-0">New Transactions</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* <!--/ Sales Overview--> */}

            {/* <!-- Ratings --> */}
            <div className="col-lg-3 col-sm-6">
              <div className="card h-100">
                <div className="row">
                  <div className="col-6">
                    <div className="card-body">
                      <div className="card-info mb-5">
                        <h6 className="mb-2 text-nowrap">Total Assignments</h6>
                        <div className="badge bg-label-primary rounded-pill lh-xs">
                          Year of 2021
                        </div>
                      </div>
                      <div className="d-flex align-items-center">
                        <h4 className="mb-0 me-2">{assignmentCount}</h4>
                        <p className="mb-0 text-success">+15.6%</p>{" "}
                        {/* Keep this static or calculate dynamically if needed */}
                      </div>
                    </div>
                  </div>
                  <div className="col-6 text-end d-flex align-items-end">
                    <div className="card-body pb-0 pt-7">
                      <img
                        src="/assets/img/illustrations/card-ratings-illustration.png"
                        alt="Ratings"
                        className="img-fluid"
                        width="95"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-sm-6">
              <div className="card h-100">
                <div className="row">
                  <div className="col-6">
                    <div className="card-body">
                      <div className="card-info mb-5">
                        <h6 className="mb-2 text-nowrap">Total Leads</h6>
                        <div className="badge bg-label-success rounded-pill lh-xs">
                          Year of 2021
                        </div>
                      </div>
                      <div className="d-flex align-items-center">
                        <h4 className="mb-0 me-2">{leadCount}</h4>
                        <p className="mb-0 text-danger">-25.5%</p>{" "}
                        {/* Keep static or dynamic */}
                      </div>
                    </div>
                  </div>
                  <div className="col-6 text-end d-flex align-items-end">
                    <div className="card-body pb-0 pt-7">
                      <img
                        src="/assets/img/illustrations/card-session-illustration.png"
                        alt="Ratings"
                        className="img-fluid"
                        width="81"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* <!--/ Ratings --> */}

            {/* <!-- Sessions --> */}
            {/* <div className="col-lg-3 col-sm-6">
              <div className="card h-100">
                <div className="row">
                  <div className="col-6">
                    <div className="card-body">
                      <div className="card-info mb-5">
                        <h6 className="mb-2 text-nowrap">Total Leads</h6>
                        <div className="badge bg-label-success rounded-pill lh-xs">
                          Year of 2021
                        </div>
                      </div>
                      <div className="d-flex align-items-center">
                        <h4 className="mb-0 me-2">12256</h4>
                        <p className="mb-0 text-danger">-25.5%</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-6 text-end d-flex align-items-end">
                    <div className="card-body pb-0 pt-7">
                      <img
                        src="/assets/img/illustrations/card-session-illustration.png"
                        alt="Ratings"
                        className="img-fluid"
                        width="81"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div> */}
            {/* <!--/ Sessions --> */}

            <div className="col-lg-6 col-sm-6">
              <div className="card h-100">
                <div className="card-header">
                  <div className="d-flex justify-content-between">
                    <h5 className="mb-1">Users</h5>
                    <div className="dropdown">
                      <button
                        className="btn btn-text-secondary rounded-pill text-muted border-0 p-1"
                        type="button"
                        id="salesOverview"
                        data-bs-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        <i className="ri-more-2-line ri-20px"></i>
                      </button>
                      <div
                        className="dropdown-menu dropdown-menu-end"
                        aria-labelledby="salesOverview"
                      >
                        <a className="dropdown-item" href="javascript:void(0);">
                          Refresh
                        </a>
                        <a className="dropdown-item" href="javascript:void(0);">
                          Share
                        </a>
                        <a className="dropdown-item" href="javascript:void(0);">
                          Update
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="d-flex align-items-center card-subtitle">
                    <div className="me-2">Total 48056 users</div>
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
                      <h5 className="mb-0">8,458</h5>
                      <p className="mb-0">Active Users</p>
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-3">
                    <div className="avatar">
                      <div className="avatar-initial bg-label-warning rounded">
                        <i className="ri-pie-chart-2-line ri-24px"></i>
                      </div>
                    </div>
                    <div className="card-info">
                      <h5 className="mb-0">2800</h5>
                      <p className="mb-0">Professional Users</p>
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-3">
                    <div className="avatar">
                      <div className="avatar-initial bg-label-info rounded">
                        <i className="ri-arrow-left-right-line ri-24px"></i>
                      </div>
                    </div>
                    <div className="card-info">
                      <h5 className="mb-0">23</h5>
                      <p className="mb-0">No of Countries</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* <!-- Total Visits --> */}
            <div className="col-lg-6 col-sm-6">
              <div className="card">
                <div className="card-header">
                  <div className="d-flex justify-content-between flex-wrap gap-2">
                    <p className="d-block mb-0 text-body">Total Visits</p>
                    <div className="d-flex align-items-center text-success">
                      <p className="mb-0">+18.4%</p>
                      <i className="ri-arrow-up-s-line ri-20px"></i>
                    </div>
                  </div>
                  <h4 className="mb-0">42.5k</h4>
                </div>
                <div className="card-body">
                  <div className="row">
                    {/* <!-- First Block (Android) --> */}
                    <div className="col-3">
                      <div className="d-flex gap-2 align-items-center mb-2">
                        <div className="avatar avatar-xs flex-shrink-0">
                          <div className="avatar-initial rounded bg-label-warning">
                            <i className="ri-android-line ri-16px"></i>
                          </div>
                        </div>
                        <p className="mb-0">Android</p>
                      </div>
                      <h4 className="mb-2">23.5%</h4>
                      <p className="mb-0">2,890</p>
                    </div>

                    {/* <!-- Divider --> */}
                    <div className="col-1 d-flex justify-content-center align-items-center">
                      <div className="divider divider-vertical m-0">
                        <div className="divider-text">
                          <span className="badge-divider-bg">VS</span>
                        </div>
                      </div>
                    </div>

                    {/* <!-- Second Block (iOS) --> */}
                    <div className="col-3">
                      <div className="d-flex gap-2 align-items-center mb-2">
                        <div className="avatar avatar-xs flex-shrink-0">
                          <div className="avatar-initial rounded bg-label-warning">
                            <i className="ri-apple-line ri-16px"></i>
                          </div>
                        </div>
                        <p className="mb-0">iOS</p>
                      </div>
                      <h4 className="mb-2">45.0%</h4>
                      <p className="mb-0">5,500</p>
                    </div>

                    {/* <!-- Divider --> */}
                    <div className="col-1 d-flex justify-content-center align-items-center">
                      <div className="divider divider-vertical m-0">
                        <div className="divider-text">
                          <span className="badge-divider-bg">VS</span>
                        </div>
                      </div>
                    </div>

                    {/* <!-- Third Block (Desktop) --> */}
                    <div className="col-3">
                      <div className="d-flex gap-2 align-items-center mb-2">
                        <div className="avatar avatar-xs flex-shrink-0">
                          <div className="avatar-initial rounded bg-label-warning">
                            <i className="ri-desktop-line ri-16px"></i>
                          </div>
                        </div>
                        <p className="mb-0">Desktop</p>
                      </div>
                      <h4 className="mb-2">31.5%</h4>
                      <p className="mb-0">3,890</p>
                    </div>
                  </div>

                  {/* <!-- Progress Bar --> */}
                  <div className="d-flex align-items-center mt-4">
                    <div
                      className="progress w-100 rounded"
                      style={{ height: "8px" }}
                    >
                      <div
                        className="progress-bar bg-warning"
                        style={{ width: "8px" }}
                        role="progressbar"
                        aria-valuenow="23.5"
                        aria-valuemin="0"
                        aria-valuemax="100"
                      ></div>
                      <div
                        className="progress-bar bg-primary"
                        style={{ width: "45%" }}
                        role="progressbar"
                        aria-valuenow="45.0"
                        aria-valuemin="0"
                        aria-valuemax="100"
                      ></div>
                      <div
                        className="progress-bar bg-success"
                        style={{ width: "31.5%" }}
                        role="progressbar"
                        aria-valuenow="31.5"
                        aria-valuemin="0"
                        aria-valuemax="100"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* <!--/ Total Visits --> */}

            {/* <!-- Sales This Months --> */}
            <div className="col-6 col-sm-6">
              <div className="card">
                <div className="card-header d-flex justify-content-between">
                  <div>
                    <h5 className="card-title mb-0">New User Registration</h5>
                    <small className="text-muted">
                      Monthly user Registration
                    </small>
                  </div>
                  <div className="d-sm-flex d-none align-items-center">
                    <h5 className="mb-0 me-4">100,000</h5>
                    <span className="badge bg-label-secondary rounded-pill">
                      <i className="ri-arrow-down-line ri-14px text-danger"></i>
                      <span className="align-middle">2022</span>
                    </span>
                  </div>
                </div>
                <div className="card-body">
                  <div id="lineChart"></div>
                </div>
              </div>
            </div>

            <div className="col-12 col-lg-6">
              <div className="card h-100">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Users Feedback</h5>
                  <input
                    type="text"
                    className="form-control form-control-sm w-auto"
                    placeholder="Search name or email"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div
                  className="card-body pt-4"
                  style={{ maxHeight: "400px", overflowY: "auto" }}
                >
                  <ul className="timeline card-timeline mb-0">
                    {filteredFeedbacks.map((fb) => (
                      <li
                        key={fb.id}
                        className="timeline-item timeline-item-transparent"
                      >
                        <span className="timeline-point timeline-point-primary"></span>
                        <div className="timeline-event">
                          <div className="timeline-header mb-2">
                            <h6 className="mb-0">{fb.user_name}</h6>
                            <small className="text-muted">
                              {new Date(fb.feedback_date).toLocaleString()}
                            </small>
                          </div>
                          <div className="mb-2">
                            <small className="text-muted d-block">
                              Email: {fb.email}
                            </small>
                            <small className="text-muted d-block">
                              User ID: {fb.user_id}
                            </small>
                          </div>
                          <p className="mb-2">{fb.feedback}</p>
                        </div>
                      </li>
                    ))}
                    {filteredFeedbacks.length === 0 && (
                      <li className="text-muted px-3">No feedbacks found.</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-12 col-12 ">
            <div className="card">
              <div className="card-header header-elements">
                <h5 className="card-title mb-0">Yearly Revenue</h5>
                <div className="card-action-element ms-auto py-0"></div>
              </div>
              <div className="card-body">
                <canvas
                  id="barChart"
                  className="chartjs"
                  data-height="400"
                ></canvas>
              </div>
            </div>
          </div>
        </div>

        <footer className="content-footer footer bg-footer-theme">
          <div className="container-xxl">
            <div className="footer-container d-flex align-items-center justify-content-between py-4 flex-md-row flex-column">
              <div className="text-body mb-2 mb-md-0">
                ©<script>document.write(new Date().getFullYear());</script>,
                made with{" "}
                <span className="text-danger">
                  <i className="tf-icons ri-heart-fill"></i>
                </span>
                by
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
        {/* <!-- / Footer --> */}

        <div className="content-backdrop fade"></div>
      </div>
    </div>
  );
}
