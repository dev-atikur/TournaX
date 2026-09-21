import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AdminShell } from "./AdminDashboardPage";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import Button from "../../components/common/Button";
import matchApi from "../../api/match.api";
import tournamentApi from "../../api/tournament.api";
import { extractList, getApiError } from "../../utils/errors";
import { GAME_MODES } from "../../utils/constants";
import { entityId } from "../../utils/format";

export default function AdminMatchesPage() {
  const [tournaments, setTournaments] = useState([]);
  const [matches, setMatches] = useState([]);
  const [form, setForm] = useState({
    tournamentId: "",
    matchNumber: 1,
    title: "",
    gameMode: "Solo",
    map: "Bermuda",
    scheduledAt: "",
    roomId: "",
    roomPassword: "",
  });

  useEffect(() => {
    tournamentApi.list({ limit: 50 }).then((res) => setTournaments(extractList(res.data).items));
  }, []);

  useEffect(() => {
    if (!form.tournamentId) return;
    matchApi
      .list({ tournamentId: form.tournamentId, limit: 50 })
      .then((res) => setMatches(extractList(res.data).items))
      .catch(() => setMatches([]));
  }, [form.tournamentId]);

  const create = async (e) => {
    e.preventDefault();
    try {
      await matchApi.create(form);
      toast.success("Match created");
      const res = await matchApi.list({ tournamentId: form.tournamentId, limit: 50 });
      setMatches(extractList(res.data).items);
    } catch (err) {
      toast.error(getApiError(err));
    }
  };

  return (
    <AdminShell title="Admin matches">
      <form onSubmit={create} className="grid gap-3 rounded-2xl border border-border bg-surface p-4 md:grid-cols-2">
        <Select label="Tournament" value={form.tournamentId} onChange={(e) => setForm((p) => ({ ...p, tournamentId: e.target.value }))} required>
          <option value="">Select tournament</option>
          {tournaments.map((item) => (
            <option key={entityId(item)} value={entityId(item)}>
              {item.title}
            </option>
          ))}
        </Select>
        <Input label="Match number" type="number" value={form.matchNumber} onChange={(e) => setForm((p) => ({ ...p, matchNumber: Number(e.target.value) }))} />
        <Input label="Title" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} required />
        <Select label="Mode" value={form.gameMode} onChange={(e) => setForm((p) => ({ ...p, gameMode: e.target.value }))}>
          {GAME_MODES.map((mode) => <option key={mode}>{mode}</option>)}
        </Select>
        <Input label="Map" value={form.map} onChange={(e) => setForm((p) => ({ ...p, map: e.target.value }))} />
        <Input label="Scheduled" type="datetime-local" value={form.scheduledAt} onChange={(e) => setForm((p) => ({ ...p, scheduledAt: e.target.value }))} required />
        <Input label="Room ID" value={form.roomId} onChange={(e) => setForm((p) => ({ ...p, roomId: e.target.value }))} />
        <Input label="Room password" value={form.roomPassword} onChange={(e) => setForm((p) => ({ ...p, roomPassword: e.target.value }))} />
        <Button type="submit" className="md:col-span-2">Create match</Button>
      </form>
      <ul className="mt-6 space-y-2">
        {matches.map((item) => (
          <li key={entityId(item)} className="rounded-xl border border-border bg-surface px-4 py-3 text-sm">
            #{item.matchNumber} {item.title} · {item.status}
          </li>
        ))}
      </ul>
    </AdminShell>
  );
}
