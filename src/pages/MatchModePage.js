import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Page from "../components/common/Page";
import EmptyState from "../components/common/EmptyState";
import Spinner from "../components/common/Spinner";
import TournamentCard from "../components/Tournament/TournamentCard";
import { MATCH_CATEGORIES } from "../utils/constants";
import tournamentApi from "../api/tournament.api";
import { extractList, getApiError } from "../utils/errors";
import { Swords } from "lucide-react";

export default function MatchModePage() {
  const { slug } = useParams();
  const category = useMemo(
    () => MATCH_CATEGORIES.flatMap((group) => group.items).find((item) => item.slug === slug),
    [slug],
  );
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!category) return undefined;
    let active = true;
    const load = async () => {
      setLoading(true);
      try {
        const response = await tournamentApi.list({
          gameMode: category.gameMode,
          search: category.search,
          limit: 12,
        });
        if (active) setItems(extractList(response.data).items);
      } catch (err) {
        if (active) setError(getApiError(err));
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [category]);

  if (!category) {
    return (
      <Page>
        <EmptyState title="Unknown match type" actionLabel="Back to matches" as={Link} to="/matches" />
      </Page>
    );
  }

  return (
    <Page>
      <Link to="/matches" className="text-sm text-primary">← All match types</Link>
      <h1 className="mt-3 text-2xl font-bold">{category.title}</h1>
      <p className="mt-2 max-w-2xl text-sm text-textMuted">{category.description}</p>
      <div className="mt-6">
        {loading ? (
          <Spinner />
        ) : items.length ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {items.map((tournament) => (
              <TournamentCard key={tournament.id || tournament._id} tournament={tournament} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Swords}
            title="No matches in this category"
            description={error || "Check back when a new room is published."}
            actionLabel="Browse tournaments"
            as={Link}
            to="/tournaments"
          />
        )}
      </div>
    </Page>
  );
}
