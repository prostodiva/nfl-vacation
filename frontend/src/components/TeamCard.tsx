import { useState } from 'react';
import { CiEdit } from "react-icons/ci";
import { FiShoppingBag } from 'react-icons/fi';
import { RiDeleteBin6Line } from "react-icons/ri";
import type { Team } from '../store/types/teamTypes';
import Button from './Button';
import SouvenirsList from './dashboard/SouvenirList';

interface TeamCardProps {
  team: Team;
  isAdmin?: boolean;
  onEdit?: (team: Team) => void;
  onDelete?: (teamId: string) => void;
  showSouvenirs?: boolean;
  showAddToCart?: boolean;
  onAddToCart?: (souvenirId: string) => void;
  onExpandedChange?: (isExpanded: boolean) => void;
}

function TeamCard({ 
  team, 
  isAdmin = false, 
  onEdit, 
  onDelete,
  showSouvenirs = false,
  showAddToCart = false,
  onAddToCart,
  onExpandedChange
}: TeamCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't toggle if clicking on buttons or if souvenirs are disabled
    if (!showSouvenirs) return;
    
    // Don't toggle if clicking on admin buttons or edit/delete buttons
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('[role="button"]')) {
      return;
    }
    
    const newExpandedState = !isExpanded;
    setIsExpanded(newExpandedState);
    onExpandedChange?.(newExpandedState);
  };

  return (
    <div className="space-y-2 w-full">
      <div 
        className={`bg-white rounded-lg shadow hover:shadow-lg transition p-4 w-full ${
          showSouvenirs 
            ? 'hover:bg-[#3b3c5e] hover:text-white cursor-pointer' 
            : 'hover:bg-[#3b3c5e] hover:text-white'
        }`}
        onClick={handleCardClick}
      >
        <div className="flex justify-between items-start mb-2">
          <div>
            <h2 className="text-2xl font-bold">{team.teamName}</h2>
            <p>{team.stadium.name}</p>
          </div>
          <div className="text-right flex items-center gap-2">
            {showSouvenirs && (
              <FiShoppingBag 
                className={`${isExpanded ? 'text-[#e93448]' : 'text-gray-400'}`}
                size={20}
              />
            )}
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
        
        {showSouvenirs && (
          <div className="text-xs text-gray-500 mt-2">
            Click to {isExpanded ? 'hide' : 'view'} souvenirs
          </div>
        )}
        
        {isAdmin && onEdit && onDelete && (
          <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
            <Button rounded onClick={() => onEdit(team)}>
              <CiEdit />
            </Button>
            <Button rounded onClick={() => onDelete(team._id)}>
              <RiDeleteBin6Line />
            </Button>
          </div>
        )}
      </div>

      {/* Souvenirs Section */}
      {showSouvenirs && isExpanded && (
        <div 
          className="bg-[#3b3c5e] rounded-lg p-4 border border-gray-200 mt-2"
          onPointerDown={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
              <FiShoppingBag />
              Souvenirs at {team.stadium.name}
            </h3>
          </div>
          <SouvenirsList
            teamName={team.teamName}
            stadiumName={team.stadium.name}
            showAddToCart={showAddToCart}
            onAddToCart={onAddToCart}
            compact={true}
            showTitle={false}
            variant="trip"
          />
        </div>
      )}
    </div>
  );
}

export default TeamCard;
