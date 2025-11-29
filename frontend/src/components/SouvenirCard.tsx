import Button from './Button';
import { RiDeleteBin6Line } from "react-icons/ri";
import { CiEdit } from "react-icons/ci";
import { FiTag } from "react-icons/fi";
import type { Souvenir } from '../store/types/teamTypes';

interface SouvenirCardProps {
    souvenir: Souvenir;
    isAdmin?: boolean;
    onEdit?: (souvenir: Souvenir) => void;
    onDelete?: (souvenirId: string) => void;
    onAddToCart?: (souvenirId: string) => void;
    showAddToCart?: boolean;
}

function SouvenirCard({ 
    souvenir, 
    isAdmin = false, 
    onEdit, 
    onDelete,
    onAddToCart,
    showAddToCart = false
}: SouvenirCardProps) {
    const categoryColors = {
        'Apparel': 'bg-blue-100 text-black',
        'Accessories': 'bg-green-100 text-black',
        'Collectibles': 'bg-purple-100 text-black',
        'Food & Beverage': 'bg-orange-100 text-black'
    };

    return (
        <div className="bg-white rounded-lg shadow hover:shadow-lg transition p-4 hover:bg-[#3b3c5e] text-gray-800 hover:text-white">
            {/* Stadium Header Section */}
            <div className="flex items-center">
                <div>
                    <p className="text-sm font-semibold">{souvenir.stadiumName}</p>
                    <p className="text-xs opacity-90">{souvenir.teamName}</p>
                </div>
            </div>

            {/* Main Content */}
            <div className="p-2">
                <div className="flex justify-between items-start mb-2 font-bold">
                    <div className="flex-1">
                        <h3 className="mb-1">{souvenir.name}</h3>
                    </div>
                    <div className="text-right">
                        <p className="text-xl font-bold text-[#e93448]">${souvenir.price.toFixed(2)}</p>
                    </div>
                </div>

                {/* Category and Tags */}
                <div className="flex flex-wrap gap-2 mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${categoryColors[souvenir.category]}`}>
                        <FiTag className="inline mr-1" />
                        {souvenir.category}
                    </span>
                    {souvenir.isTraditional && (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#3b3c5e] text-white border">
                            Traditional
                        </span>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-4">
                    {showAddToCart && onAddToCart && (
                        <Button
                            onClick={() => onAddToCart(souvenir._id)}
                            className="flex items-center"
                            add
                            rounded
                        >
                            ADD
                        </Button>
                    )}
                    {isAdmin && onEdit && onDelete && (
                        <>
                            <Button rounded onClick={() => onEdit(souvenir)} className="px-3 hover:bg-[#e93448]">
                                <CiEdit />
                            </Button>
                            <Button rounded onClick={() => onDelete(souvenir._id)} className="px-3 hover:bg-[#e93448]">
                                <RiDeleteBin6Line />
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default SouvenirCard;