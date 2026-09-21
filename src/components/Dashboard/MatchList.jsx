import MatchCard from "../Match/MatchCard";

export default function MatchList({ items = [] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {items.map((item) => (
        <MatchCard key={item.id || item._id} match={item} />
      ))}
    </div>
  );
}
