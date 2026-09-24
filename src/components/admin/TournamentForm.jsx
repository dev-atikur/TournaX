import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import Input from "../common/Input";
import Select from "../common/Select";
import Button from "../common/Button";
import { GAME_MODES, FF_MAPS, TOURNAMENT_STATUSES, TOURNAMENT_STATUS_TRANSITIONS } from "../../utils/constants";
import { formatStatus, toDatetimeLocal } from "../../utils/format";
import tournamentApi from "../../api/tournament.api";
import { getApiError } from "../../utils/errors";

const empty = {
  title: "",
  description: "",
  banner: "",
  gameMode: "Solo",
  map: "Bermuda",
  prizePool: 0,
  entryFee: 0,
  maxPlayers: 48,
  registrationStart: "",
  registrationEnd: "",
  tournamentStart: "",
  tournamentEnd: "",
  status: TOURNAMENT_STATUSES.REGISTRATION_OPEN,
  rules: "",
  prizeDistribution: "",
};

function fromTournament(item) {
  if (!item) return empty;
  return {
    title: item.title || "",
    description: item.description || "",
    banner: item.banner || item.bannerUrl || "",
    gameMode: item.gameMode || "Solo",
    map: item.map || "Bermuda",
    prizePool: item.prizePool ?? 0,
    entryFee: item.entryFee ?? 0,
    maxPlayers: item.maxPlayers ?? 48,
    registrationStart: toDatetimeLocal(item.registrationStart),
    registrationEnd: toDatetimeLocal(item.registrationEnd),
    tournamentStart: toDatetimeLocal(item.tournamentStart),
    tournamentEnd: toDatetimeLocal(item.tournamentEnd),
    status: item.status || TOURNAMENT_STATUSES.DRAFT,
    rules: item.rules || "",
    prizeDistribution: Array.isArray(item.prizeDistribution)
      ? item.prizeDistribution.map((row) => `${row.place || row.rank}: ${row.amount || row.prize}`).join("\n")
      : item.prizeDistribution || "",
  };
}

export default function TournamentForm({ tournament, onSuccess, submitLabel }) {
  const [form, setForm] = useState(() => fromTournament(tournament));
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const statusOptions = useMemo(() => {
    if (!tournament) return Object.values(TOURNAMENT_STATUSES);
    const allowed = [tournament.status, ...(TOURNAMENT_STATUS_TRANSITIONS[tournament.status] || [])];
    return Array.from(new Set(allowed));
  }, [tournament]);

  const validate = () => {
    const next = {};
    if (!form.title.trim()) next.title = "Title is required";
    if (!form.gameMode) next.gameMode = "Game mode is required";
    if (!form.maxPlayers) next.maxPlayers = "Max players is required";
    if (!form.registrationStart) next.registrationStart = "Registration start is required";
    if (!form.registrationEnd) next.registrationEnd = "Registration deadline is required";
    if (!form.tournamentStart) next.tournamentStart = "Start time is required";
    if (!form.tournamentEnd) next.tournamentEnd = "End time is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!validate()) return;
    setSaving(true);
    const payload = {
      ...form,
      entryFee: Number(form.entryFee),
      prizePool: Number(form.prizePool),
      maxPlayers: Number(form.maxPlayers),
      registrationStart: new Date(form.registrationStart).toISOString(),
      registrationEnd: new Date(form.registrationEnd).toISOString(),
      tournamentStart: new Date(form.tournamentStart).toISOString(),
      tournamentEnd: new Date(form.tournamentEnd).toISOString(),
    };
    try {
      if (tournament?.id || tournament?._id) {
        const id = tournament.id || tournament._id;
        await tournamentApi.update(id, payload);
        toast.success("Tournament updated");
      } else {
        await tournamentApi.create(payload);
        toast.success("Tournament created");
      }
      onSuccess?.();
    } catch (error) {
      toast.error(getApiError(error, "Could not save tournament"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="grid gap-3 md:grid-cols-2">
      <Input label="Tournament title" value={form.title} error={errors.title} onChange={(e) => set("title", e.target.value)} required />
      <Select label="Game mode" value={form.gameMode} onChange={(e) => set("gameMode", e.target.value)}>
        {GAME_MODES.map((mode) => (
          <option key={mode}>{mode}</option>
        ))}
      </Select>
      <Select label="Map" value={form.map} onChange={(e) => set("map", e.target.value)}>
        {FF_MAPS.map((map) => (
          <option key={map}>{map}</option>
        ))}
      </Select>
      <Select label="Status" value={form.status} onChange={(e) => set("status", e.target.value)}>
        {statusOptions.map((status) => (
          <option key={status} value={status}>
            {formatStatus(status)}
          </option>
        ))}
      </Select>
      <Input label="Prize pool" type="number" value={form.prizePool} onChange={(e) => set("prizePool", e.target.value)} />
      <Input label="Entry fee" type="number" value={form.entryFee} onChange={(e) => set("entryFee", e.target.value)} />
      <Input
        label="Maximum players"
        type="number"
        value={form.maxPlayers}
        error={errors.maxPlayers}
        onChange={(e) => set("maxPlayers", e.target.value)}
      />
      <Input label="Banner URL" value={form.banner} onChange={(e) => set("banner", e.target.value)} />
      <Input
        label="Registration start"
        type="datetime-local"
        value={form.registrationStart}
        error={errors.registrationStart}
        onChange={(e) => set("registrationStart", e.target.value)}
      />
      <Input
        label="Registration deadline"
        type="datetime-local"
        value={form.registrationEnd}
        error={errors.registrationEnd}
        onChange={(e) => set("registrationEnd", e.target.value)}
      />
      <Input
        label="Tournament start"
        type="datetime-local"
        value={form.tournamentStart}
        error={errors.tournamentStart}
        onChange={(e) => set("tournamentStart", e.target.value)}
      />
      <Input
        label="Tournament end"
        type="datetime-local"
        value={form.tournamentEnd}
        error={errors.tournamentEnd}
        onChange={(e) => set("tournamentEnd", e.target.value)}
      />
      <div className="md:col-span-2">
        <label className="mb-1.5 block text-sm font-medium text-textSecondary">Description</label>
        <textarea
          rows={3}
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          className="w-full rounded-xl border border-border bg-surfaceHard px-4 py-3 text-sm outline-none focus:border-primary"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-textSecondary">Rules</label>
        <textarea
          rows={4}
          value={form.rules}
          onChange={(e) => set("rules", e.target.value)}
          className="w-full rounded-xl border border-border bg-surfaceHard px-4 py-3 text-sm outline-none focus:border-primary"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-textSecondary">Prize distribution</label>
        <textarea
          rows={4}
          value={form.prizeDistribution}
          placeholder={"1: 5000\n2: 3000\n3: 1500"}
          onChange={(e) => set("prizeDistribution", e.target.value)}
          className="w-full rounded-xl border border-border bg-surfaceHard px-4 py-3 text-sm outline-none focus:border-primary"
        />
      </div>
      <Button type="submit" loading={saving} className="md:col-span-2">
        {submitLabel || (tournament ? "Save changes" : "Create tournament")}
      </Button>
    </form>
  );
}
