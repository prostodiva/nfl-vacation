import type { Team } from '../store/types/teamTypes';

interface TeamCardProps {
  team: Team;
}

function TeamCard({ team }: TeamCardProps) {
  return (
    <div className="bg-[#262422] rounded-lg shadow hover:shadow-lg transition p-4">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h2 className="text-2xl font-bold text-white">{team.teamName}</h2>
          <p className="text-white">{team.stadium.name}</p>
        </div>
        <div className="text-right">
          <span className="text-sm text-white">
            {team.conference === 'National Football Conference' ? 'NFC' : 'AFC'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div>
          <p className="text-xs text-white">Location</p>
          <p className="text-sm font-semibold text-white">{team.stadium.location}</p>
        </div>
        <div>
          <p className="text-xs text-white">Capacity</p>
          <p className="text-sm font-semibold text-white">
            {team.stadium.seatingCapacity.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-xs text-white">Year Opened</p>
          <p className="text-sm font-semibold text-white">
            {team.stadium.yearOpened}
          </p>
        </div>
        <div>
          <p className="text-xs text-white">Surface</p>
          <p className="text-sm font-semibold text-white">{team.stadium.surfaceType}</p>
        </div>
        <div>
          <p className="text-xs text-white">Roof</p>
          <p className="text-sm font-semibold text-white">{team.stadium.roofType}</p>
        </div>
      </div>
    </div>
  );
}

export default TeamCard;
