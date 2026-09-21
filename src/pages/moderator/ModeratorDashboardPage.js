import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Page from "../../components/common/Page";
import tournamentApi from "../../api/tournament.api";
import { extractList } from "../../utils/errors";
import { entityId } from "../../utils/format";
import TournamentStatus from "../../components/Tournament/TournamentStatus";

export default function ModeratorDashboardPage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    tournamentApi.list({ limit: 30 }).then((res) => setItems(extractList(res.data).items)).catch(() => {});
  }, []);

  return (
    <Page>
      <h1 className="text-2xl font-bold">Moderator</h1>
      <p className="mt-1 text-sm text-textMuted">Manage assigned cups, rooms, and result verification. User roles stay admin-only.</p>
      <div className="mt-6 flex gap-3 text-sm">
        <Link className="text-primary" to="/moderator/matches">Matches</Link>
        <Link className="text-primary" to="/moderator/results">Verify results</Link>
      </div>
      <ul className="mt-6 space-y-3">
        {items.map((item) => (
          <li key={entityId(item)} className="flex items-center justify-between rounded-xl border border-border bg-surface px-4 py-3">
            <div>
              <p className="font-medium">{item.title}</p>
              <p className="text-xs text-textMuted">{item.gameMode}</p>
            </div>
            <TournamentStatus status={item.status} />
          </li>
        ))}
      </ul>
    </Page>
  );
}
