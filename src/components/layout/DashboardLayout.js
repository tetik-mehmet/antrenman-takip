"use client";

import { useState, useEffect } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

const SIDEBAR_COLLAPSED_KEY = "sidebar-collapsed";

function getInitialCollapsed() {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === "true";
  } catch {
    return false;
  }
}

export default function DashboardLayout({
  children,
  title,
  userEmail,
  userName,
  isAdmin,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    setSidebarCollapsed(getInitialCollapsed());
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(sidebarCollapsed));
    } catch {
      // ignore
    }
  }, [sidebarCollapsed]);

  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  function closeSidebar() {
    setSidebarOpen(false);
  }

  function toggleSidebarCollapsed() {
    setSidebarCollapsed((c) => !c);
    if (sidebarOpen) setSidebarOpen(false);
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
      <Header
        title={title}
        userEmail={userEmail}
        userName={userName || ""}
        isAdmin={isAdmin}
        onMenuToggle={() => setSidebarOpen((o) => !o)}
        sidebarOpen={sidebarOpen}
        sidebarCollapsed={sidebarCollapsed}
        onSidebarCollapseToggle={toggleSidebarCollapsed}
      />
      <div className="flex">
        {/* Overlay: mobilde sidebar açıkken arka plan, tıklanınca kapat */}
        <div
          aria-hidden="true"
          className={`fixed inset-0 z-10 bg-slate-900/50 transition-opacity duration-200 md:pointer-events-none md:invisible md:opacity-0 ${
            sidebarOpen
              ? "pointer-events-auto visible opacity-100"
              : "pointer-events-none invisible opacity-0"
          }`}
          onClick={closeSidebar}
        />
        <Sidebar
          isAdmin={isAdmin}
          isOpen={sidebarOpen}
          onClose={closeSidebar}
          collapsed={sidebarCollapsed}
          onCollapseToggle={toggleSidebarCollapsed}
        />
        <main className="min-h-[calc(100vh-3.5rem)] flex-1 min-w-0 p-4 sm:p-6 transition-[margin] duration-200 ease-out">
          {children}
        </main>
      </div>
    </div>
  );
}
