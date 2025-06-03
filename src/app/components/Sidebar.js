"use client";
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { href: "/Dashboard", icon: "ri-mail-open-line", label: "Dashboards" },
    {
      href: "/UserManagement",
      icon: "ri-wechat-line",
      label: "User Management",
    },
    {
      href: "/Subscriptions",
      icon: "ri-mail-open-line",
      label: "Subscriptions",
    },
    {
      href: "/PlanManagement",
      icon: "ri-wechat-line",
      label: "Plans Management",
    },
    { href: "/Coupons", icon: "ri-calendar-line", label: "Coupons" },
    { href: "/Revenue", icon: "ri-drag-drop-line", label: "Revenue Reports" },
    { href: "/Feedback", icon: "ri-wechat-line", label: "Feedback" },
  ];

  return (
    <aside
      id="layout-menu"
      className="layout-menu menu-vertical menu bg-menu-theme"
    >
      <div className="app-brand demo">
        <Link href="/" className="app-brand-link d-flex align-items-center">
          <span className="app-brand-logo demo d-flex align-items-center">
            {/* PNG Image in front of Camrilla */}
            <img
              src="/images/logo.png"
              alt="Camrilla Logo"
              style={{ width: "30px", height: "30px", marginRight: "8px" }}
            />
            <span className="app-brand-text demo menu-text fw-semibold">
              Camrilla
            </span>
          </span>
        </Link>
        <a
          href="javascript:void(0);"
          className="layout-menu-toggle menu-link text-large ms-auto"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* SVG paths... */}
          </svg>
        </a>
      </div>

      <div className="menu-inner-shadow"></div>

      <ul className="menu-inner py-1">
        {menuItems.map((item) => (
          <li
            key={item.href}
            className={`menu-item${
              pathname.startsWith(item.href) ? " active" : ""
            }`}
          >
            <Link href={item.href} className="menu-link">
              <i className={`menu-icon tf-icons ${item.icon}`}></i>
              <div>{item.label}</div>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
