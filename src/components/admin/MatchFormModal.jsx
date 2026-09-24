import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Modal from "../common/Modal";
import Input from "../common/Input";
import Select from "../common/Select";
import Button from "../common/Button";
import matchApi from "../../api/match.api";
import { GAME_MODES, FF_MAPS, MATCH_STATUSES } from "../../utils/constants";
import { entityId, formatStatus, toDatetimeLocal } from "../../utils/format";
import { getApiError } from "../../utils/errors";

export default function MatchFormModal({ open, match, tournaments = [], onClose, onSaved }) {
  const [form, setForm] = useState({
    tournamentId: "",
    matchNumber: 1,
    title: "",
    gameMode: "Solo",
    map: "Bermuda",
    roomId: "",
    roomPassword: "",
    scheduledAt: "",
    status: MATCH_STATUSES.SCHEDULED,
  });
  const [saving, setSaving] = useState(false);
  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  useEffect(() => {
    if (!open) return;
    if (match) {
      setForm({
        tournamentId: entityId(match.tournamentId) || match.tournamentId || "",
        matchNumber: match.matchNumber || 1,
        title: match.title || "",
        gameMode: match.gameMode || "Solo",
        map: match.map || "Bermuda",
        roomId: match.roomId || "",
        roomPassword: match.roomPassword || "",
        scheduledAt: toDatetimeLocal(match.scheduledAt),
        status: match.status || MATCH_STATUSES.SCHEDULED,
      });
    } else {
      setForm((prev) => ({
        ...prev,
        tournamentId: prev.tournamentId || entityId(tournaments[0]) || "",
      }));
    }
  }, [open, match, tournaments]);

  const submit = async (event) => {
    event.preventDefault();
    if (!form.tournamentId || !form.title || !form.scheduledAt) {
      toast.error("Tournament, title, and schedule are required");
      return;
    }
    setSaving(true);
    const payload = {
      ...form,
      matchNumber: Number(form.matchNumber),
      scheduledAt: new Date(form.scheduledAt).toISOString(),
    };
    try {
      if (match) await matchApi.update(entityId(match), payload);
      else await matchApi.create(payload);
      toast.success(match ? "Match updated" : "Match created");
      onSaved?.();
      onClose?.();
    } catch (error) {
      toast.error(getApiError(error, "Could not save match"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      title={match ? "Edit match" : "Create match"}
      size="lg"
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button form="match-form" type="submit" loading={saving}>
            {match ? "Save match" : "Create match"}
          </Button>
        </>
      }
    >
      <form id="match-form" onSubmit={submit} className="grid gap-3 sm:grid-cols-2">
        <Select label="Tournament" value={form.tournamentId} onChange={(e) => set("tournamentId", e.target.value)} required>
          <option value="">Select tournament</option>
          {tournaments.map((item) => (
            <option key={entityId(item)} value={entityId(item)}>
              {item.title}
            </option>
          ))}
        </Select>
        <Input label="Match number" type="number" value={form.matchNumber} onChange={(e) => set("matchNumber", e.target.value)} />
        <Input label="Title" value={form.title} onChange={(e) => set("title", e.target.value)} required className="sm:col-span-2" />
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
        <Input
          label="Scheduled time"
          type="datetime-local"
          value={form.scheduledAt}
          onChange={(e) => set("scheduledAt", e.target.value)}
          required
        />
        <Select label="Status" value={form.status} onChange={(e) => set("status", e.target.value)}>
          {Object.values(MATCH_STATUSES).map((status) => (
            <option key={status} value={status}>
              {formatStatus(status)}
            </option>
          ))}
        </Select>
        <Input label="Room ID" value={form.roomId} onChange={(e) => set("roomId", e.target.value)} hint="Shown only to staff and registered players when room is ready." />
        <Input label="Room password" value={form.roomPassword} onChange={(e) => set("roomPassword", e.target.value)} />
      </form>
    </Modal>
  );
}
