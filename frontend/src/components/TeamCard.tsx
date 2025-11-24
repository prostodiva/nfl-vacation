import type { Team } from '../store/types/teamTypes';
import Button from './Button';

interface TeamCardProps {
  team: Team;
  isAdmin?: boolean;
  onEdit?: (team: Team) => void;
  onDelete?: (teamId: string) => void;
}

function TeamCard({ team, isAdmin = false, onEdit, onDelete  }: TeamCardProps) {
  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition p-4 hover:bg-[#f76d1b]">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h2 className="text-2xl font-bold">{team.teamName}</h2>
          <p>{team.stadium.name}</p>
        </div>
        <div className="text-right">
          <span className="text-sm">
            {team.conference === 'National Football Conference' ? 'NFC' : 'AFC'}
          </span>
        </div>
      </div>

      <div className="text-xs flex gap-15 mb-2 flex-wrap">
          <p className="text-sm font-semibold">{team.stadium.location}</p>
          <p className="text-sm font-semibold">
            {team.stadium.seatingCapacity.toLocaleString()}
          </p>
          <p className="text-sm font-semibold">
            {team.stadium.yearOpened}
          </p>
          <p className="text-sm font-semibold">{team.stadium.surfaceType}</p>
          <p className="text-sm font-semibold">{team.stadium.roofType}</p>
      </div>
      {isAdmin && onEdit && onDelete && (
        <div className="flex gap-2">
          <Button rounded onClick={() => onEdit(team)}>Edit</Button>
          <Button rounded onClick={() => onDelete(team._id)}>Delete</Button>
        </div>
      )}
    </div>
  );
}

export default TeamCard;
