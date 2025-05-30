'use client';
import Link from 'next/link';
import React from 'react';

export default function Sidebar() {
  return (
    <aside id="layout-menu" className="layout-menu menu-vertical menu bg-menu-theme">
      <div className="app-brand demo">
        <Link href="/" className="app-brand-link">
          <span className="app-brand-logo demo">
            <span style={{ color: 'var(--bs-primary)' }}>
              <svg width="268" height="150" viewBox="0 0 38 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* SVG paths... */}
              </svg>
            </span>
          </span>
          <span className="app-brand-text demo menu-text fw-semibold ms-2">Materialize</span>
        </Link>

        <a href="javascript:void(0);" className="layout-menu-toggle menu-link text-large ms-auto">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* SVG paths... */}
          </svg>
        </a>
      </div>

      <div className="menu-inner-shadow"></div>

      <ul className="menu-inner py-1">
        <li className="menu-item active">
          <Link href="/Dashboard" className="menu-link">
            <i className="menu-icon tf-icons ri-mail-open-line"></i>
            <div>Dashboards</div>
          </Link>
        </li>
        <li className="menu-item">
          <Link href="/UserManagement" className="menu-link">
            <i className="menu-icon tf-icons ri-wechat-line"></i>
            <div>User Management</div>
          </Link>
        </li>
        <li className="menu-item">
          <Link href="/Subscriptions" className="menu-link">
            <i className="menu-icon tf-icons ri-mail-open-line"></i>
            <div>Subscriptions</div>
          </Link>
        </li>
        <li className="menu-item">
          <Link href="/PlanManagement" className="menu-link">
            <i className="menu-icon tf-icons ri-wechat-line"></i>
            <div>Plans Management</div>
          </Link>
        </li>
        <li className="menu-item">
          <Link href="/Coupons" className="menu-link">
            <i className="menu-icon tf-icons ri-calendar-line"></i>
            <div>Coupons</div>
          </Link>
        </li>
        <li className="menu-item">
          <Link href="/Revenue" className="menu-link">
            <i className="menu-icon tf-icons ri-drag-drop-line"></i>
            <div>Revenue Reports</div>
          </Link>
        </li>
        <li className="menu-item">
          <Link href="/Feedback" className="menu-link">
            <i className="menu-icon tf-icons ri-wechat-line"></i>
            <div>Feedback</div>
          </Link>
        </li>
      </ul>
    </aside>
  );
}
