import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/layouts/Header";

export default function AppLayout() {
  const { pathname } = useLocation();
  const staffChrome = pathname.startsWith("/admin") || pathname.startsWith("/moderator");

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-background text-textPrimary">
      {staffChrome ? null : <Header />}
      <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
}
