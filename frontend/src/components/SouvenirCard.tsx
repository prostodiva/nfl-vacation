import Button from './Button';
import { RiDeleteBin6Line } from "react-icons/ri";
import { CiEdit } from "react-icons/ci";
import type { Souvenir } from '../store/types/teamTypes';

interface SouvenirCardProps {
    souvenir: Souvenir;
    isAdmin?: boolean;
    onEdit?: (souvenir: Souvenir) => void;
    onDelete?: (souvenirId: string) => void;
}

function SouvenirCard({ souvenir, isAdmin = false, onEdit, onDelete }: SouvenirCardProps) {
    const categoryColors = {
        'Apparel': 'bg-blue-100 text-blue-800',
        'Accessories': 'bg-green-100 text-green-800',
        'Collectibles': 'bg-purple-100 text-purple-800',
        'Food & Beverage': 'bg-orange-100 text-orange-800'
    };

    return (
        <div className="bg-white rounded-lg shadow hover:shadow-lg transition p-4 hover:bg-[#e93448]">
            <div className="flex justify-between items-start mb-2">
                <div>
                    <h2 className="text-2xl font-bold">{souvenir.name}</h2>
                    <p className="text-sm text-gray-600">{souvenir.teamName}</p>
                </div>
                <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">${souvenir.price.toFixed(2)}</p>
                </div>
            </div>

            <div className="text-xs flex gap-15 mb-2 flex-wrap items-center">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${categoryColors[souvenir.category]}`}>
                    {souvenir.category}
                </span>
                {souvenir.isTraditional && (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                        Traditional
                    </span>
                )}
                <p className="text-sm font-semibold">{souvenir.stadiumName}</p>
            </div>
            
            {isAdmin && onEdit && onDelete && (
                <div className="flex gap-2">
                    <Button rounded onClick={() => onEdit(souvenir)}>
                        <CiEdit />
                    </Button>
                    <Button rounded onClick={() => onDelete(souvenir._id)}>
                        <RiDeleteBin6Line />
                    </Button>
                </div>
            )}
        </div>
    );
}

export default SouvenirCard;