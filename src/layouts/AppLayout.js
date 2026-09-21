import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/layouts/Header";

export default function AppLayout() {
  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-background text-textPrimary">
      <Header />
      <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
}
