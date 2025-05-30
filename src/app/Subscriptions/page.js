'use client'
import React, { useEffect, useState } from 'react'

export default function Page() {
  const [transactions, setTransactions] = useState([])
  const [users, setUsers] = useState([])
  const [userTransactions, setUserTransactions] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [transactionPage, setTransactionPage] = useState(1)
  const [userPage, setUserPage] = useState(1)

  const ITEMS_PER_PAGE = 10

  useEffect(() => {
    fetch('http://localhost:4000/api/transactions')
      .then((res) => res.json())
      .then((data) => setTransactions(data))
      .catch((err) => console.error('Transaction fetch error:', err))

    fetch('http://localhost:4000/api/users')
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error('User fetch error:', err))
  }, [])

  const paginate = (data, page) => {
    const start = (page - 1) * ITEMS_PER_PAGE
    return data.slice(start, start + ITEMS_PER_PAGE)
  }

  const totalTransactionPages = Math.ceil(transactions.length / ITEMS_PER_PAGE)
  const totalUserPages = Math.ceil(users.length / ITEMS_PER_PAGE)

  const handleViewTransactions = async (email) => {
    try {
      const res = await fetch(`http://localhost:4000/api/transactions?email=${email}`)
      const data = await res.json()
      setUserTransactions(data)
      setSelectedUser(email)
      setIsModalOpen(true)
    } catch (err) {
      console.error('Error fetching user transactions:', err)
    }
  }

  return (
    <div className="content-wrapper">
      <div className="container-xxl flex-grow-1 container-p-y">
        {/* Transactions Table */}
        <div className="card mb-5">
          <h5 className="card-header">Transaction History</h5>
          <div className="table-responsive text-nowrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>User Name</th>
                  <th>Email</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Payment Method</th>
                  <th>Status</th>
                  <th>Reference ID</th>
                </tr>
              </thead>
              <tbody className="table-border-bottom-0">
                {paginate(transactions, transactionPage).map((txn) => (
                  <tr key={txn.id}>
                    <td>{txn.transaction_id}</td>
                    <td>{txn.user_name}</td>
                    <td>{txn.email}</td>
                    <td>₹{txn.amount}</td>
                    <td>{txn.date}</td>
                    <td>{txn.payment_method}</td>
                    <td>
                      <span
                        className={`badge rounded-pill ${
                          txn.status.toLowerCase() === 'completed'
                            ? 'bg-label-success'
                            : 'bg-label-danger'
                        } me-1`}
                      >
                        {txn.status}
                      </span>
                    </td>
                    <td>{txn.reference_id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination Controls */}
          <div className="d-flex justify-content-between align-items-center p-3">
            <div>
              Page {transactionPage} of {totalTransactionPages}
            </div>
            <div>
              <button
                className="btn btn-sm btn-outline-primary me-2"
                disabled={transactionPage === 1}
                onClick={() => setTransactionPage((prev) => prev - 1)}
              >
                Previous
              </button>
              <button
                className="btn btn-sm btn-outline-primary"
                disabled={transactionPage === totalTransactionPages}
                onClick={() => setTransactionPage((prev) => prev + 1)}
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="card mb-5">
          <h5 className="card-header">User List with Transaction History</h5>
          <div className="table-responsive text-nowrap">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>User Name</th>
                  <th>Email</th>
                  <th>Mobile</th>
                  <th>Plan Status</th>
                  <th>Transactions</th>
                </tr>
              </thead>
              <tbody className="table-border-bottom-0">
                {paginate(users, userPage).map((user) => {
                  const userLastTxn = transactions
                    .filter((txn) => txn.email === user.email)
                    .sort((a, b) => new Date(b.date) - new Date(a.date))[0]

                  return (
                    <tr key={user.id}>
                      <td>
                        <i className="ri-user-2-line ri-22px text-primary me-4"></i>
                        <span className="fw-medium">{user.name}</span>
                      </td>
                      <td>{user.email}</td>
                      <td>{user.mobile}</td>
                      <td>
                        <span
                          className={`badge rounded-pill ${
                            userLastTxn?.status?.toLowerCase() === 'success'
                              ? 'bg-label-success'
                              : 'bg-label-danger'
                          } me-1`}
                        >
                          {userLastTxn?.status || 'No Transactions'}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-outline-primary"
                          onClick={() => handleViewTransactions(user.email)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          {/* Pagination Controls */}
          <div className="d-flex justify-content-between align-items-center p-3">
            <div>
              Page {userPage} of {totalUserPages}
            </div>
            <div>
              <button
                className="btn btn-sm btn-outline-primary me-2"
                disabled={userPage === 1}
                onClick={() => setUserPage((prev) => prev - 1)}
              >
                Previous
              </button>
              <button
                className="btn btn-sm btn-outline-primary"
                disabled={userPage === totalUserPages}
                onClick={() => setUserPage((prev) => prev + 1)}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for User Transactions */}
      {isModalOpen && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
          <div className="modal-dialog modal-lg">
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
                {userTransactions.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>Transaction ID</th>
                          <th>Amount</th>
                          <th>Date</th>
                          <th>Method</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {userTransactions.map((txn) => (
                          <tr key={txn.id}>
                            <td>{txn.transaction_id}</td>
                            <td>₹{txn.amount}</td>
                            <td>{txn.date}</td>
                            <td>{txn.payment_method}</td>
                            <td>
                              <span
                                className={`badge rounded-pill ${
                                  txn.status.toLowerCase() === 'success'
                                    ? 'bg-label-success'
                                    : 'bg-label-danger'
                                }`}
                              >
                                {txn.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
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

      {/* Footer */}
      <footer className="content-footer footer bg-footer-theme">
        <div className="container-xxl">
          <div className="footer-container d-flex align-items-center justify-content-between py-4 flex-md-row flex-column">
            <div className="text-body mb-2 mb-md-0">
              © {new Date().getFullYear()}, made with
              <span className="text-danger">
                <i className="tf-icons ri-heart-fill"></i>
              </span>{' '}
              by <a href="https://pixinvent.com" target="_blank" className="footer-link">Coinage</a>
            </div>
            <div className="d-none d-lg-inline-block">
              <a href="https://themeforest.net/licenses/standard" className="footer-link me-4" target="_blank">License</a>
              <a href="https://1.envato.market/pixinvent_portfolio" target="_blank" className="footer-link me-4">More Themes</a>
              <a href="https://demos.pixinvent.com/materialize-html-admin-template/documentation/" target="_blank" className="footer-link me-4">Documentation</a>
              <a href="https://pixinvent.ticksy.com/" target="_blank" className="footer-link d-none d-sm-inline-block">Support</a>
            </div>
          </div>
        </div>
      </footer>

      <div className="content-backdrop fade"></div>
    </div>
  )
}
