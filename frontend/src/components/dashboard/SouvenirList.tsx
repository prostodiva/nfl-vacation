// components/SouvenirsList.tsx
import SouvenirCard from '../SouvenirCard'

interface Souvenir {
    _id: string;
    name: string;
    price: number;
    category: 'Apparel' | 'Accessories' | 'Collectibles' | 'Food & Beverage';
    isTraditional: boolean;
    teamName: string;
    stadiumName: string;
}

interface SouvenirsListProps {
    souvenirs?: Souvenir[];
    isLoading: boolean;
    onEdit: (souvenir: Souvenir) => void;
    onDelete: (souvenirId: string) => void;
}

function SouvenirsList({ souvenirs, isLoading, onEdit, onDelete }: SouvenirsListProps) {
    if (isLoading) {
        return <div className="text-white text-center py-8">Loading souvenirs...</div>;
    }

    if (!souvenirs || souvenirs.length === 0) {
        return <div className="text-white text-center py-8">No souvenirs found.</div>;
    }

    return (
        <div className="space-y-2">
            <h2 className="text-white text-2xl font-bold mb-4">
                Souvenirs ({souvenirs.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {souvenirs.map((souvenir) => (
                    <SouvenirCard
                        key={souvenir._id}
                        souvenir={souvenir}
                        isAdmin={true}
                        onEdit={() => onEdit(souvenir)}
                        onDelete={() => onDelete(souvenir._id)}
                    />
                ))}
            </div>
        </div>
    );
}

export default SouvenirsList;