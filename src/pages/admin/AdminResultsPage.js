import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AdminShell } from "./AdminDashboardPage";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import matchApi from "../../api/match.api";
import tournamentApi from "../../api/tournament.api";
import adminApi from "../../api/admin.api";
import { extractList, getApiError } from "../../utils/errors";
import { entityId } from "../../utils/format";

export default function AdminResultsPage() {
  const [tournaments, setTournaments] = useState([]);
  const [matches, setMatches] = useState([]);
  const [matchId, setMatchId] = useState("");
  const [tournamentId, setTournamentId] = useState("");
  const [reports, setReports] = useState([]);
  const [row, setRow] = useState({ userId: "", placement: 1, kills: 0 });

  useEffect(() => {
    tournamentApi.list({ limit: 50 }).then((res) => setTournaments(extractList(res.data).items));
    adminApi.listReports({ limit: 20 }).then((res) => setReports(extractList(res.data).items)).catch(() => {});
  }, []);

  useEffect(() => {
    if (!tournamentId) return;
    matchApi.list({ tournamentId, limit: 50 }).then((res) => setMatches(extractList(res.data).items)).catch(() => setMatches([]));
  }, [tournamentId]);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await matchApi.submitResults(matchId, { results: [row] });
      toast.success("Result submitted");
    } catch (err) {
      toast.error(getApiError(err));
    }
  };

  const verify = async () => {
    try {
      await matchApi.verifyResults(matchId);
      toast.success("Results verified");
    } catch (err) {
      toast.error(getApiError(err));
    }
  };

  return (
    <AdminShell title="Results & reports">
      <form onSubmit={submit} className="grid gap-3 rounded-2xl border border-border bg-surface p-4 md:grid-cols-2">
        <select className="rounded-xl border border-border bg-surfaceHard px-3 py-3 text-sm" value={tournamentId} onChange={(e) => setTournamentId(e.target.value)}>
          <option value="">Tournament</option>
          {tournaments.map((item) => <option key={entityId(item)} value={entityId(item)}>{item.title}</option>)}
        </select>
        <select className="rounded-xl border border-border bg-surfaceHard px-3 py-3 text-sm" value={matchId} onChange={(e) => setMatchId(e.target.value)}>
          <option value="">Match</option>
          {matches.map((item) => <option key={entityId(item)} value={entityId(item)}>#{item.matchNumber} {item.title}</option>)}
        </select>
        <Input label="User ID" value={row.userId} onChange={(e) => setRow((p) => ({ ...p, userId: e.target.value }))} />
        <Input label="Placement" type="number" value={row.placement} onChange={(e) => setRow((p) => ({ ...p, placement: Number(e.target.value) }))} />
        <Input label="Kills" type="number" value={row.kills} onChange={(e) => setRow((p) => ({ ...p, kills: Number(e.target.value) }))} />
        <div className="flex items-end gap-2">
          <Button type="submit">Submit result</Button>
          <Button type="button" variant="secondary" onClick={verify}>Verify results</Button>
        </div>
      </form>
      <h2 className="mt-8 font-semibold">Reports</h2>
      <ul className="mt-3 space-y-2">
        {reports.map((item) => (
          <li key={entityId(item)} className="rounded-xl border border-border bg-surface px-4 py-3 text-sm">
            {item.reason} · {item.status}
          </li>
        ))}
      </ul>
    </AdminShell>
  );
}
