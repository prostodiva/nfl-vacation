import type { Team } from '../store/types/teamTypes';

interface TeamCardProps {
  team: Team;
}

function TeamCard({ team }: TeamCardProps) {
  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition p-4">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{team.teamName}</h2>
          <p className="text-gray-600">{team.stadium.name}</p>
        </div>
        <div className="text-right">
          <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded">
            {team.conference === 'National Football Conference' ? 'NFC' : 'AFC'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div>
          <p className="text-xs text-gray-500">Location</p>
          <p className="text-sm font-semibold">{team.stadium.location}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Capacity</p>
          <p className="text-sm font-semibold">
            {team.stadium.seatingCapacity.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Surface</p>
          <p className="text-sm font-semibold">{team.stadium.surfaceType}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Roof</p>
          <p className="text-sm font-semibold">{team.stadium.roofType}</p>
        </div>
      </div>
    </div>
  );
}

export default TeamCard;
