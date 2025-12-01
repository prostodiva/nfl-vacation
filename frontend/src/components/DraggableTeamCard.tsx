import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState } from 'react';
import type { Team } from '../store/types/teamTypes';
import Button from './Button';
import TeamCard from './TeamCard';

interface DraggableTeamCardProps {
    team: Team;
    onRemove: (id: string) => void;
    showSouvenirs?: boolean;
    showAddToCart?: boolean;
    onAddToCart?: (souvenirId: string, quantity: number) => void;
}

function DraggableTeamCard({ 
  team, 
  onRemove,
  showSouvenirs = false,
  showAddToCart = false,
  onAddToCart
}: DraggableTeamCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: team._id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="relative w-full"
        >
            {/* Drag Handle - Hide when souvenirs are expanded */}
            {!isExpanded && (
                <div
                    {...attributes}
                    {...listeners}
                    className="absolute left-2 top-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing z-10 bg-gray-200 hover:bg-[#3b3c5e] rounded p-2"
                    aria-label="Drag to reorder"
                >
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="text-gray-400"
                    >
                        <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z" />
                    </svg>
                </div>
            )}

            {/* Team Card with margin for drag handle - keep margin consistent */}
            <div className="ml-12 w-full">
                <TeamCard 
                  team={team}
                  showSouvenirs={showSouvenirs}
                  showAddToCart={showAddToCart}
                  onAddToCart={onAddToCart}
                  onExpandedChange={setIsExpanded}
                />
            </div>

            {/* Remove Button */}
            <Button
                onClick={() => onRemove(team._id)}
                className="absolute top-12 right-4 hover:text-black text-white rounded-full z-10"
                aria-label="Remove team"
            >
                ✕
            </Button>
        </div>
    );
}

export default DraggableTeamCard;