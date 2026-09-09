import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../components/layouts/Header'

export default function AppLayout() {
  
  return (
    <figure className="flex flex-col h-screen w-screen bg-background *:text-textPrimary overflow-hidden">
      <Header />
      <Outlet />
    </figure>
  );
}