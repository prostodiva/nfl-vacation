import { useState } from "react";
import TeamsList from "../components/TeamList.tsx";
import { useGetAllTeamsQuery } from '../store/apis/teamsApi';

function TeamsPage() {
  const [showTeams] = useState(false);
  const { data: teamsData } = useGetAllTeamsQuery();

  return <div>
    {showTeams && teamsData?.data && <TeamsList teams={teamsData.data} />}
  </div>;
}

export default TeamsPage;
