import type { StadiumItem } from '../store/types/teamTypes';
import Button from './Button';


interface StadiumCardProps {
  stadium: StadiumItem;
  isAdmin?: boolean;
  onEdit: (stadium: StadiumItem) => void;
  onDelete: (stadiumName: string) => void;
}

function StadiumCard({ stadium, isAdmin = false, onEdit, onDelete }: StadiumCardProps) {
  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition p-4 hover:bg-[#f76d1b]">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h2 className="text-2xl font-bold">{stadium.stadiumName}</h2>
          <p>{stadium.stadiumName}</p>
        </div>
      </div>

      <div className="text-xs flex gap-15 mb-2 flex-wrap">
          <p className="text-sm font-semibold">{stadium.location}</p>
          <p className="text-sm font-semibold">
            {stadium.seatingCapacity.toLocaleString()}
          </p>
          <p className="text-sm font-semibold">
            {stadium.yearOpened}
          </p>
          <p className="text-sm font-semibold">{stadium.surfaceType}</p>
          <p className="text-sm font-semibold">{stadium.roofType}</p>
      </div>
      
      {isAdmin && onEdit && onDelete && (
        <div className="flex gap-2">
          <Button rounded onClick={() => onEdit(stadium)}>Edit</Button>
          <Button rounded onClick={() => onDelete(stadium.stadiumName)}>Delete</Button>
        </div>
      )}
    </div>
  );
}

export default StadiumCard;
