import TournamentCard from "../Tournament/TournamentCard";

export default function HomeTournamentCard(props) {
  if (props.tournament) return <TournamentCard {...props} />;

  return (
    <TournamentCard
      tournament={{
        _id: props.id || props.title,
        title: props.title,
        status: String(props.status || "upcoming").toLowerCase().replace(" ", "_"),
        gameMode: props.type,
        prizePool: props.prize,
        currentPlayers: Number(String(props.players || "0").split("/")[0]) || 0,
        maxPlayers: Number(String(props.players || "0").split("/")[1]) || 0,
        map: props.map || "Bermuda",
        entryFee: props.entryFee || 0,
        registrationEnd: props.registrationEnd,
        tournamentStart: props.tournamentStart,
      }}
    />
  );
}
