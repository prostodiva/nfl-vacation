import { useState } from 'react';
import { CiEdit } from "react-icons/ci";
import { FiTag } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import type { Souvenir } from '../store/types/teamTypes';
import Button from './Button';

interface SouvenirCardProps {
    souvenir: Souvenir;
    isAdmin?: boolean;
    onEdit?: (souvenir: Souvenir) => void;
    onDelete?: (souvenirId: string) => void;
    onAddToCart?: (souvenirId: string, quantity: number, event?: React.MouseEvent<HTMLButtonElement>) => void;
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
    const [quantity, setQuantity] = useState<number>(1);
    
    const categoryColors = {
        'Apparel': 'bg-blue-100 text-black',
        'Accessories': 'bg-green-100 text-black',
        'Collectibles': 'bg-purple-100 text-black',
        'Food & Beverage': 'bg-orange-100 text-black'
    };

    const handleAddClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (onAddToCart && quantity > 0) {
            onAddToCart(souvenir._id, quantity, e);
            setQuantity(1); 
        }
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

                {/* Category, Tags, and Action Buttons in one line */}
                <div className="flex flex-wrap items-center gap-2 mt-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${categoryColors[souvenir.category]}`}>
                        <FiTag className="inline mr-1" />
                        {souvenir.category}
                    </span>
                    {souvenir.isTraditional && (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#3b3c5e] text-white border">
                            Traditional
                        </span>
                    )}
                    {showAddToCart && onAddToCart && (
                        <div className="flex items-center gap-2 ml-auto">
                            <input
                                type="number"
                                min="1"
                                value={quantity}
                                onChange={(e) => {
                                    const val = parseInt(e.target.value) || 1;
                                    setQuantity(Math.max(1, val));
                                }}
                                className="w-16 px-2 py-1 border rounded text-center text-sm text-gray-400"
                                onClick={(e) => e.stopPropagation()}
                            />
                            <button
                                onClick={handleAddClick}
                                className="flex items-center py-1 px-6 border text-white bg-[#e93448] hover:text-black rounded-[1vw]"
                            >
                                ADD
                            </button>
                        </div>
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