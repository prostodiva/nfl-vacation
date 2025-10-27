import TeamsList from "../components/TeamsList.tsx";
import {useState} from "react";

function TeamsPage() {
  const showTeams = useState(false);

  return <div>
    {showTeams && <TeamsList />}
  </div>;
}

export default TeamsPage;
