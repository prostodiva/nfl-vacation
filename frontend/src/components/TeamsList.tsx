import { useGetAllTeamsQuery } from "../store/apis/teamsApi";

function TeamsList() {
    const { data: teams, isLoading, error } = useGetAllTeamsQuery();
    
    if (isLoading) {
        return <div>Loading teams...</div>;
    }
    if (error) {
        return <div>Error loading teams.</div>;
    }
    
    return (
        <div>
            {teams?.data.map((team) => (
                <div key={team._id}>
                    <h2>{team.teamName}</h2>
                </div>
            ))}
        </div>
    );
}

export default TeamsList;
