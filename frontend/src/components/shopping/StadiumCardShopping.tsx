import { FiCalendar, FiHome, FiMapPin, FiUsers } from 'react-icons/fi';
import type { StadiumItem } from '../../store/types/teamTypes';

interface StadiumCardShoppingProps {
  stadium: StadiumItem;
  souvenirCount?: number;
  isSelected?: boolean;
  onClick: () => void;
}

function StadiumCardShopping({ 
  stadium, 
  souvenirCount = 0, 
  isSelected = false,
  onClick 
}: StadiumCardShoppingProps) {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 
        cursor-pointer border-2 overflow-hidden
        ${isSelected 
          ? 'border-[#e93448] ring-2 ring-[#e93448] ring-opacity-50' 
          : 'border-transparent hover:border-gray-300'
        }
      `}
    >
      {/* Header with Stadium Name */}
      <div className={`p-4 ${isSelected ? 'bg-[#e93448]' : 'bg-gradient-to-r from-[#3b3c5e] to-[#4a4d6e]'} text-white`}>
        <h3 className="text-xl font-bold mb-1">{stadium.stadiumName}</h3>
        <div className="flex items-center gap-2 text-sm opacity-90">
          <FiMapPin className="text-[#e93448]" />
          <span>{stadium.location || 'N/A'}</span>
        </div>
      </div>

      {/* Stadium Details */}
      <div className="p-4 space-y-2">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <FiUsers className="text-[#3b3c5e]" />
          <span>{stadium.seatingCapacity?.toLocaleString() ?? 'N/A'} seats</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <FiCalendar className="text-[#3b3c5e]" />
          <span>Opened {stadium.yearOpened || 'N/A'}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <FiHome className="text-[#3b3c5e]" />
          <span>{stadium.roofType || 'N/A'} • {stadium.surfaceType || 'N/A'}</span>
        </div>
      </div>

      {/* Souvenir Count Badge */}
      {souvenirCount > 0 && (
        <div className="px-4 pb-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-2 text-center">
            <p className="text-sm font-semibold text-green-800">
              {souvenirCount} {souvenirCount === 1 ? 'Souvenir' : 'Souvenirs'} Available
            </p>
          </div>
        </div>
      )}

      {souvenirCount === 0 && (
        <div className="px-4 pb-4">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-2 text-center">
            <p className="text-sm text-gray-500">No souvenirs available</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default StadiumCardShopping;