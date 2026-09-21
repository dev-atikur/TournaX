import React, { useEffect, useState } from "react";
import { Swords } from "lucide-react";
import Page from "../components/common/Page";
import MatchCategoryCard from "../components/Match/MatchCategoryCard";
import { MATCH_CATEGORIES } from "../utils/constants";
import tournamentApi from "../api/tournament.api";
import { extractList } from "../utils/errors";

export default function MatchesPage() {
  const [counts, setCounts] = useState({});

  useEffect(() => {
    let active = true;
    const load = async () => {
      const next = {};
      await Promise.all(
        MATCH_CATEGORIES.flatMap((group) => group.items).map(async (item) => {
          try {
            const response = await tournamentApi.list({
              gameMode: item.gameMode,
              search: item.search,
              limit: 1,
            });
            next[item.slug] = extractList(response.data).pagination?.total || 0;
          } catch {
            next[item.slug] = 0;
          }
        }),
      );
      if (active) setCounts(next);
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  return (
    <Page width="max-w-6xl">
      <div className="mb-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10">
          <Swords className="h-6 w-6 text-primary" />
        </div>
        <h1 className="mt-3 text-2xl font-bold sm:text-3xl">Matches</h1>
        <p className="mx-auto mt-2 max-w-md text-sm text-textMuted">
          Choose a Free Fire format, then open rooms and scheduled matches.
        </p>
      </div>
      <div className="space-y-10">
        {MATCH_CATEGORIES.map((category) => (
          <section key={category.id}>
            <div className="mb-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <h2 className="text-lg font-bold">{category.title}</h2>
              <div className="h-px flex-1 bg-border" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {category.items.map((item) => (
                <MatchCategoryCard key={item.slug} item={item} count={counts[item.slug] || 0} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </Page>
  );
}
