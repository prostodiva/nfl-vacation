
import TeamCard from '../TeamCard';
import type { Team } from '../../store/types/teamTypes';

interface TeamsListProps {
    teams?: Team[];
    isLoading: boolean;
    onEdit: (team: Team) => void;
    onDelete: (teamId: string) => void;
}

function TeamsListDash({ teams, isLoading, onEdit, onDelete }: TeamsListProps) {
    if (isLoading) {
        return <div className="text-white text-center py-8">Loading teams...</div>;
    }

    if (!teams || teams.length === 0) {
        return <div className="text-white text-center py-8">No teams found.</div>;
    }

    return (
        <div className="space-y-2">
            <h2 className="text-white text-2xl font-bold mb-4">Teams</h2>
            {teams.map((team) => (
                <TeamCard
                    key={team._id}
                    team={team}
                    isAdmin={true}
                    onEdit={() => onEdit(team)}
                    onDelete={() => onDelete(team._id)}
                />
            ))}
        </div>
    );
}

export default TeamsListDash;
