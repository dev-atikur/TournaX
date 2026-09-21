import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AdminShell } from "./AdminDashboardPage";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import Button from "../../components/common/Button";
import TournamentStatus from "../../components/Tournament/TournamentStatus";
import tournamentApi from "../../api/tournament.api";
import { extractList, getApiError } from "../../utils/errors";
import { GAME_MODES } from "../../utils/constants";
import { entityId, formatDateTime } from "../../utils/format";

const emptyForm = {
  title: "",
  description: "",
  gameMode: "Solo",
  map: "Bermuda",
  entryFee: 0,
  prizePool: 0,
  maxPlayers: 48,
  registrationStart: "",
  registrationEnd: "",
  tournamentStart: "",
  tournamentEnd: "",
  status: "registration_open",
  rules: "",
};

export default function AdminTournamentsPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = () => {
    tournamentApi
      .list({ limit: 50 })
      .then((res) => setItems(extractList(res.data).items))
      .catch((err) => toast.error(getApiError(err)));
  };

  useEffect(() => {
    load();
  }, []);

  const create = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await tournamentApi.create({
        ...form,
        entryFee: Number(form.entryFee),
        prizePool: Number(form.prizePool),
        maxPlayers: Number(form.maxPlayers),
      });
      toast.success("Tournament created");
      setForm(emptyForm);
      load();
    } catch (err) {
      toast.error(getApiError(err, "Could not create tournament"));
    } finally {
      setSaving(false);
    }
  };

  const cancel = async (id) => {
    try {
      await tournamentApi.cancel(id);
      toast.success("Tournament cancelled");
      load();
    } catch (err) {
      toast.error(getApiError(err));
    }
  };

  return (
    <AdminShell title="Admin tournaments">
      <form onSubmit={create} className="grid gap-3 rounded-2xl border border-border bg-surface p-4 md:grid-cols-2">
        <Input label="Title" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} required />
        <Select label="Game mode" value={form.gameMode} onChange={(e) => setForm((p) => ({ ...p, gameMode: e.target.value }))}>
          {GAME_MODES.map((mode) => (
            <option key={mode}>{mode}</option>
          ))}
        </Select>
        <Input label="Map" value={form.map} onChange={(e) => setForm((p) => ({ ...p, map: e.target.value }))} />
        <Input label="Max players" type="number" value={form.maxPlayers} onChange={(e) => setForm((p) => ({ ...p, maxPlayers: e.target.value }))} />
        <Input label="Entry fee" type="number" value={form.entryFee} onChange={(e) => setForm((p) => ({ ...p, entryFee: e.target.value }))} />
        <Input label="Prize pool" type="number" value={form.prizePool} onChange={(e) => setForm((p) => ({ ...p, prizePool: e.target.value }))} />
        <Input label="Registration start" type="datetime-local" value={form.registrationStart} onChange={(e) => setForm((p) => ({ ...p, registrationStart: e.target.value }))} required />
        <Input label="Registration end" type="datetime-local" value={form.registrationEnd} onChange={(e) => setForm((p) => ({ ...p, registrationEnd: e.target.value }))} required />
        <Input label="Tournament start" type="datetime-local" value={form.tournamentStart} onChange={(e) => setForm((p) => ({ ...p, tournamentStart: e.target.value }))} required />
        <Input label="Tournament end" type="datetime-local" value={form.tournamentEnd} onChange={(e) => setForm((p) => ({ ...p, tournamentEnd: e.target.value }))} required />
        <div className="md:col-span-2">
          <Input label="Description" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
        </div>
        <Button type="submit" loading={saving} className="md:col-span-2">Create tournament</Button>
      </form>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-border">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-surfaceMuted text-textMuted">
            <tr>
              <th className="px-3 py-2">Title</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Start</th>
              <th className="px-3 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={entityId(item)} className="border-t border-border">
                <td className="px-3 py-2">{item.title}</td>
                <td className="px-3 py-2"><TournamentStatus status={item.status} /></td>
                <td className="px-3 py-2">{formatDateTime(item.tournamentStart)}</td>
                <td className="px-3 py-2">
                  <button type="button" onClick={() => cancel(entityId(item))} className="text-error">
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
