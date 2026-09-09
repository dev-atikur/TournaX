import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/logo.png";
import clsx from "clsx";
import { AuthContext } from "../../contexts/AuthContexts";

export default function Header() {
  const { pathname } = useLocation();
  const { isAuthenticated } = useContext(AuthContext);

  console.log(pathname);
  

  return (
    <header
      className={clsx(
        "flex w-full items-center justify-center h-16 px-5 bg-surfaceHard border-b border-border",
        !isAuthenticated && "items-center justify-between",
      )}
    >
      <Link to="/" className="flex items-center">
        <img
          src={logo}
          alt="TournaX Logo"
          className="w-32 h-auto object-contain"
        />
      </Link>

      {!isAuthenticated && (
        <div className="flex gap-2 items-center justify-between">
          <Link
            to="/login"
            className="px-4 py-2 text-sm font-medium text-textSecondary transition hover:text-textPrimary"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="px-4 py-2 text-sm font-semibold rounded-lg bg-primary text-textDark transition hover:bg-primaryHover"
          >
            Register
          </Link>
        </div>
      )}
    </header>
  );
}
