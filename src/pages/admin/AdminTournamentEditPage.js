import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import TournamentForm from "../../components/admin/TournamentForm";
import LoadingState from "../../components/common/LoadingState";
import ErrorState from "../../components/common/ErrorState";
import tournamentApi from "../../api/tournament.api";
import { extractEntity, getApiError } from "../../utils/errors";
import useStaff from "../../hooks/useStaff";

export default function AdminTournamentEditPage() {
  const { id } = useParams();
  const staff = useStaff();
  const navigate = useNavigate();
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    tournamentApi
      .get(id)
      .then((res) => setTournament(extractEntity(res.data)))
      .catch((err) => setError(getApiError(err, "Could not load tournament.")))
      .finally(() => setLoading(false));
  }, [id]);

  if (!staff.canEditTournament) {
    return <ErrorState title="Unauthorized" message="Only admins can edit tournaments." />;
  }
  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;

  return (
    <div>
      <div className="mb-5">
        <Link to={`${staff.basePath}/tournaments/${id}`} className="text-sm text-primary">
          ← Back to tournament
        </Link>
        <h1 className="mt-2 text-2xl font-bold">Edit tournament</h1>
        <p className="text-sm text-textMuted">Invalid status jumps are blocked in this form.</p>
      </div>
      <div className="rounded-2xl border border-border bg-surface p-5">
        <TournamentForm
          tournament={tournament}
          onSuccess={() => navigate(`${staff.basePath}/tournaments/${id}`)}
        />
      </div>
    </div>
  );
}
