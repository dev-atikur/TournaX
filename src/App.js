import React from "react";
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AppLayout from "./layouts/AppLayout";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import TournamentsPage from "./pages/TournamentsPage";
import TournamentDetailsPage from "./pages/TournamentDetailsPage";
import MatchesPage from "./pages/MatchesPage";
import MatchModePage from "./pages/MatchModePage";
import MatchDetailsPage from "./pages/MatchDetailsPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import DashboardPage from "./pages/DashboardPage";
import MyTournamentsPage from "./pages/MyTournamentsPage";
import ProfilePage from "./pages/ProfilePage";
import NotificationsPage from "./pages/NotificationsPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminTournamentsPage from "./pages/admin/AdminTournamentsPage";
import AdminMatchesPage from "./pages/admin/AdminMatchesPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminResultsPage from "./pages/admin/AdminResultsPage";
import ModeratorDashboardPage from "./pages/moderator/ModeratorDashboardPage";
import ModeratorMatchesPage from "./pages/moderator/ModeratorMatchesPage";
import { PrivacyPage, TermsPage, ContactPage } from "./pages/LegalPages";
import ProtectedRoute from "./components/routes/ProtectedRoute";
import AdminRoute from "./components/routes/AdminRoute";
import ModeratorRoute from "./components/routes/ModeratorRoute";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="reset-password" element={<ResetPasswordPage />} />
        <Route path="verify-email" element={<VerifyEmailPage />} />
        <Route path="tournaments" element={<TournamentsPage />} />
        <Route path="tournaments/:id" element={<TournamentDetailsPage />} />
        <Route path="matches" element={<MatchesPage />} />
        <Route path="matches/modes/:slug" element={<MatchModePage />} />
        <Route path="matches/:id" element={<MatchDetailsPage />} />
        <Route path="leaderboard" element={<LeaderboardPage />} />
        <Route path="privacy" element={<PrivacyPage />} />
        <Route path="terms" element={<TermsPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="dashboard/tournaments"
          element={
            <ProtectedRoute>
              <MyTournamentsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="notifications"
          element={
            <ProtectedRoute>
              <NotificationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin"
          element={
            <AdminRoute>
              <AdminDashboardPage />
            </AdminRoute>
          }
        />
        <Route
          path="admin/tournaments"
          element={
            <AdminRoute>
              <AdminTournamentsPage />
            </AdminRoute>
          }
        />
        <Route
          path="admin/matches"
          element={
            <AdminRoute>
              <AdminMatchesPage />
            </AdminRoute>
          }
        />
        <Route
          path="admin/users"
          element={
            <AdminRoute>
              <AdminUsersPage />
            </AdminRoute>
          }
        />
        <Route
          path="admin/results"
          element={
            <AdminRoute>
              <AdminResultsPage />
            </AdminRoute>
          }
        />
        <Route
          path="moderator"
          element={
            <ModeratorRoute>
              <ModeratorDashboardPage />
            </ModeratorRoute>
          }
        />
        <Route
          path="moderator/matches"
          element={
            <ModeratorRoute>
              <ModeratorMatchesPage />
            </ModeratorRoute>
          }
        />
        <Route
          path="moderator/results"
          element={
            <ModeratorRoute>
              <AdminResultsPage />
            </ModeratorRoute>
          }
        />
      </Route>,
    ),
  );

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#171923",
            color: "#f5f7fa",
            border: "1px solid #292d38",
          },
        }}
      />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
