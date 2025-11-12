import TeamsList from "../components/TeamList.tsx";
import {useState} from "react";

function TeamsPage() {
  const showTeams = useState(false);

  return <div>
    {showTeams && <TeamsList />}
  </div>;
}

export default TeamsPage;
