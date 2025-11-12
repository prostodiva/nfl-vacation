import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import TeamCard from './TeamCard';
import type { Team } from '../store/types/teamTypes';

interface DraggableTeamCardProps {
    team: Team;
    onRemove: (id: string) => void;
}

function DraggableTeamCard({ team, onRemove }: DraggableTeamCardProps) {
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
            className="relative"
        >
            {/* Drag Handle */}
            <div
                {...attributes}
                {...listeners}
                className="absolute left-2 top-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing z-10 bg-gray-200 hover:bg-gray-300 rounded p-2"
                aria-label="Drag to reorder"
            >
                <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="text-gray-600"
                >
                    <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z" />
                </svg>
            </div>

            {/* Team Card with margin for drag handle */}
            <div className="ml-12">
                <TeamCard team={team} />
            </div>

            {/* Remove Button */}
            <button
                onClick={() => onRemove(team._id)}
                className="absolute top-12 right-4 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center transition-colors z-10"
                aria-label="Remove team"
            >
                ✕
            </button>
        </div>
    );
}

export default DraggableTeamCard;