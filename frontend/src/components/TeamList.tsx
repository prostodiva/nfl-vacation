import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import DraggableTeamCard from './DraggableTeamCard';
import type { Team } from '../store/types/teamTypes';

interface DraggableTeamListProps {
  teams: Team[];
  onReorder: (teams: Team[]) => void;
  onRemoveTeam: (teamId: string) => void;
}

function TeamList({ teams, onReorder, onRemoveTeam }: DraggableTeamListProps) {
  const sensors = useSensors(
      useSensor(PointerSensor),
      useSensor(KeyboardSensor, {
        coordinateGetter: sortableKeyboardCoordinates,
      })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = teams.findIndex((team) => team._id === active.id);
      const newIndex = teams.findIndex((team) => team._id === over.id);
      const reorderedTeams = arrayMove(teams, oldIndex, newIndex);
      onReorder(reorderedTeams);
    }
  };

  if (teams.length === 0) {
    return null;
  }

  return (
      <div className="mt-6 space-y-4 w-full max-w-4xl">
        <h3 className="text-lg font-semibold">Selected Teams:</h3>
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
          <SortableContext
              items={teams.map(team => team._id)}
              strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4">
              {teams.map((team) => (
                  <DraggableTeamCard
                      key={team._id}
                      team={team}
                      onRemove={onRemoveTeam}
                  />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
  );
}

export default TeamList;
