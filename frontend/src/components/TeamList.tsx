import type { DragEndEvent } from '@dnd-kit/core';
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import type { Team } from '../store/types/teamTypes';
import DraggableTeamCard from './DraggableTeamCard';
import TeamCard from './TeamCard';

interface DraggableTeamListProps {
  teams: Team[];
  onReorder?: (teams: Team[]) => void;
  onRemoveTeam?: (teamId: string) => void;
  showSouvenirs?: boolean;
  showAddToCart?: boolean;
  onAddToCart?: (souvenirId: string, quantity: number) => void;
}

function TeamList({ 
  teams, 
  onReorder, 
  onRemoveTeam,
  showSouvenirs = false,
  showAddToCart = false,
  onAddToCart
}: DraggableTeamListProps) {
  const isInteractive = !!onReorder && !!onRemoveTeam;
  const sensors = useSensors(
      useSensor(PointerSensor),
      useSensor(KeyboardSensor, {
        coordinateGetter: sortableKeyboardCoordinates,
      })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id && onReorder) {
      const oldIndex = teams.findIndex((team) => team._id === active.id);
      const newIndex = teams.findIndex((team) => team._id === over.id);
      const reorderedTeams = arrayMove(teams, oldIndex, newIndex);
      onReorder(reorderedTeams);
    }
  };

  if (teams.length === 0) {
    return null;
  }

if (!isInteractive) {
    return (
      <div className="mt-6 space-y-4 w-full max-w-4xl">
        <div className="space-y-4">
          {teams.map((team, index) => (
            <div key={team._id} className="flex items-start gap-3">
              <span className="font-bold text-gray-500 text-lg w-10 flex-shrink-0">
                {index + 1}.
              </span>
              <div className="flex-1 min-w-0">
                <TeamCard 
                  team={team}
                  showSouvenirs={showSouvenirs}
                  showAddToCart={showAddToCart}
                  onAddToCart={onAddToCart}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
      <div className="mt-6 space-y-4 w-full max-w-4xl">
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
          <SortableContext
              items={teams.map(team => team._id)}
              strategy={verticalListSortingStrategy}
          >
            <div className="gap-4 space-y-2">
              {teams.map((team) => {
                if (!onRemoveTeam) return null;
                return (
                  <DraggableTeamCard
                    key={team._id}
                    team={team}
                    onRemove={onRemoveTeam}
                    showSouvenirs={showSouvenirs}
                    showAddToCart={showAddToCart}
                    onAddToCart={onAddToCart}
                  />
                );
              })}
            </div>
          </SortableContext>
        </DndContext>
      </div>
  );
}

export default TeamList;
