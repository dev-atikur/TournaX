export function staffPermissions(role) {
  const isAdmin = role === "admin";
  const isModerator = role === "moderator";
  const isStaff = isAdmin || isModerator;

  return {
    isAdmin,
    isModerator,
    isStaff,
    basePath: isAdmin ? "/admin" : "/moderator",
    canManageTournaments: isAdmin,
    canCreateTournament: isAdmin,
    canDeleteTournament: isAdmin,
    canEditTournament: isAdmin,
    canManageMatches: isStaff,
    canPublishResults: isStaff,
    canReviewReports: isStaff,
    canViewUsers: isStaff,
    canEditUsers: isAdmin,
    canChangeRole: isAdmin,
    canBanUsers: isStaff,
    canUnbanUsers: isStaff,
    canAccessSettings: isAdmin,
    canModerateParticipants: isStaff,
  };
}
