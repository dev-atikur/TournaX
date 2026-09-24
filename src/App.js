import React from "react";
import { createBrowserRouter, createRoutesFromElements, Navigate, Route, RouterProvider } from "react-router-dom";
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
import PublicProfilePage from "./pages/PublicProfilePage";
import ProfileRedirectPage from "./pages/ProfileRedirectPage";
import NotificationsPage from "./pages/NotificationsPage";
import SettingsLayout from "./components/settings/SettingsLayout";
import AccountSettingsPage from "./pages/settings/AccountSettingsPage";
import ProfileSettingsPage from "./pages/settings/ProfileSettingsPage";
import SecuritySettingsPage from "./pages/settings/SecuritySettingsPage";
import TwoFactorSettingsPage from "./pages/settings/TwoFactorSettingsPage";
import SessionsSettingsPage from "./pages/settings/SessionsSettingsPage";
import NotificationsSettingsPage from "./pages/settings/NotificationsSettingsPage";
import PrivacySettingsPage from "./pages/settings/PrivacySettingsPage";
import DangerSettingsPage from "./pages/settings/DangerSettingsPage";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminTournamentsPage from "./pages/admin/AdminTournamentsPage";
import AdminTournamentDetailsPage from "./pages/admin/AdminTournamentDetailsPage";
import AdminTournamentEditPage from "./pages/admin/AdminTournamentEditPage";
import AdminMatchesPage from "./pages/admin/AdminMatchesPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminResultsPage from "./pages/admin/AdminResultsPage";
import AdminReportsPage from "./pages/admin/AdminReportsPage";
import AdminSettingsPage from "./pages/admin/AdminSettingsPage";
import { PrivacyPage, TermsPage, ContactPage } from "./pages/LegalPages";
import ProtectedRoute from "./components/routes/ProtectedRoute";
import AdminRoute from "./components/routes/AdminRoute";
import ModeratorRoute from "./components/routes/ModeratorRoute";

const staffPages = (
  <>
    <Route index element={<AdminDashboardPage />} />
    <Route path="tournaments" element={<AdminTournamentsPage />} />
    <Route path="tournaments/:id" element={<AdminTournamentDetailsPage />} />
    <Route path="tournaments/:id/edit" element={<AdminTournamentEditPage />} />
    <Route path="matches" element={<AdminMatchesPage />} />
    <Route path="users" element={<AdminUsersPage />} />
    <Route path="results" element={<AdminResultsPage />} />
    <Route path="reports" element={<AdminReportsPage />} />
    <Route path="settings" element={<AdminSettingsPage />} />
  </>
);

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
        <Route path="profile" element={<ProfileRedirectPage />} />
        <Route path="profile/:username" element={<PublicProfilePage />} />
        <Route
          path="settings"
          element={
            <ProtectedRoute>
              <SettingsLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="account" replace />} />
          <Route path="account" element={<AccountSettingsPage />} />
          <Route path="profile" element={<ProfileSettingsPage />} />
          <Route path="security" element={<SecuritySettingsPage />} />
          <Route path="2fa" element={<TwoFactorSettingsPage />} />
          <Route path="sessions" element={<SessionsSettingsPage />} />
          <Route path="notifications" element={<NotificationsSettingsPage />} />
          <Route path="privacy" element={<PrivacySettingsPage />} />
          <Route path="danger" element={<DangerSettingsPage />} />
        </Route>
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
              <AdminLayout />
            </AdminRoute>
          }
        >
          {staffPages}
        </Route>
        <Route
          path="moderator"
          element={
            <ModeratorRoute>
              <AdminLayout />
            </ModeratorRoute>
          }
        >
          {staffPages}
        </Route>
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
