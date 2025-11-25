
import StadiumCard from '../StadiumCard';
import type { StadiumItem } from '../../store/types/teamTypes';

interface StadiumsListProps {
    stadiums?: StadiumItem[];
    isLoading: boolean;
    onEdit: (stadium: StadiumItem) => void;
    onDelete: (stadiumId: string) => void;
}

function StadiumsList({ stadiums, isLoading, onEdit, onDelete }: StadiumsListProps) {
    if (isLoading) {
        return <div className="text-white text-center py-8">Loading stadiums...</div>;
    }

    if (!stadiums || stadiums.length === 0) {
        return <div className="text-white text-center py-8">No stadiums found.</div>;
    }

    return (
        <div className="space-y-2">
            <h2 className="text-white text-2xl font-bold mb-4">Stadiums</h2>
            {stadiums.map((stadium) => (
                <StadiumCard
                    key={stadium._id}
                    stadium={stadium}
                    isAdmin={true}
                    onEdit={() => onEdit(stadium)}
                    onDelete={() => onDelete(stadium._id)}
                />
            ))}
        </div>
    );
}

export default StadiumsList;