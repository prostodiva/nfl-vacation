import { useState, useMemo } from 'react';
import { useGetAllSouvenirsQuery } from '../store/apis/souvenirsApi';
import { useGetAllStadiumsQuery } from '../store/apis/stadiumsApi';
import { useAddToCartMutation } from '../store/apis/purchaseApi';
import SouvenirCard from '../components/SouvenirCard';
import StadiumCardShopping from '../components/shopping/StadiumCardShopping';
import ShoppingCart from '../components/shopping/ShoppingCart';
import PurchaseTracking from '../components/shopping/PurchaseTracking';
import Button from '../components/Button';
import { FiShoppingCart, FiBarChart2, FiX, FiFilter } from 'react-icons/fi';

function ShoppingPage() {
  const [showCart, setShowCart] = useState(false);
  const [showTracking, setShowTracking] = useState(false);
  const [selectedStadium, setSelectedStadium] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'stadiums' | 'souvenirs'>('stadiums');
  
  const { data: souvenirsData, isLoading: isLoadingSouvenirs } = useGetAllSouvenirsQuery();
  const { data: stadiumsData, isLoading: isLoadingStadiums } = useGetAllStadiumsQuery();
  const [addToCart] = useAddToCartMutation();

  const souvenirs = souvenirsData?.data || [];
  const stadiums = stadiumsData?.data || [];

  // Group souvenirs by stadium
  const souvenirsByStadium = useMemo(() => {
    const grouped: Record<string, typeof souvenirs> = {};
    souvenirs.forEach(souvenir => {
      if (!grouped[souvenir.stadiumName]) {
        grouped[souvenir.stadiumName] = [];
      }
      grouped[souvenir.stadiumName].push(souvenir);
    });
    return grouped;
  }, [souvenirs]);

  // Get souvenir count for each stadium
  const stadiumSouvenirCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    stadiums.forEach(stadium => {
      counts[stadium.stadiumName] = souvenirsByStadium[stadium.stadiumName]?.length || 0;
    });
    return counts;
  }, [stadiums, souvenirsByStadium]);

  // Filtered souvenirs based on selected stadium
  const filteredSouvenirs = useMemo(() => {
    if (!selectedStadium) return [];
    return souvenirsByStadium[selectedStadium] || [];
  }, [selectedStadium, souvenirsByStadium]);

  const handleStadiumClick = (stadiumName: string) => {
    setSelectedStadium(stadiumName);
    setViewMode('souvenirs');
  };

  const handleAddToCart = async (souvenirId: string) => {
    try {
      await addToCart({ souvenirId, quantity: 1 }).unwrap();
      setShowCart(true);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  const handleBackToStadiums = () => {
    setSelectedStadium(null);
    setViewMode('stadiums');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-8 py-8">
        {/* Header */}
        <div className="flex flex-col items-center space-y-2 mb-8">
          <div>
            <h1 
              className="text-5xl leading-tight text-black mt-6" 
              style={{ fontFamily: 'SCHABO, sans-serif' }}
            >
              SOUVENIR SHOP
            </h1>
            {selectedStadium && (
              <div className="mt-2 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">Viewing souvenirs for:</span>
                  <span className="font-semibold text-[#e93448]">{selectedStadium}</span>
                </div>
                <div className="flex gap-4">
                  <Button onClick={() => setShowTracking(!showTracking)}>
                    <FiBarChart2 className="inline mr-2" />
                    {showTracking ? 'Hide' : 'View'} Tracking
                  </Button>
                  <Button onClick={() => setShowCart(true)}>
                    <FiShoppingCart className="inline mr-2" />
                    Cart
                  </Button>
                </div>
              </div>
            )}
          </div>

          {!selectedStadium && (
            <div className="flex gap-4">
              <Button onClick={() => setShowTracking(!showTracking)}>
                <FiBarChart2 className="inline mr-2" />
                {showTracking ? 'Hide' : 'View'} Tracking
              </Button>
              <Button onClick={() => setShowCart(true)}>
                <FiShoppingCart className="inline mr-2" />
                Cart
              </Button>
            </div>
          )}
        </div>
        
        {/* Purchase Tracking Section */}
        {showTracking && (
          <div className="mb-8">
            <PurchaseTracking />
          </div>
        )}

        {/* Stadiums View */}
        {!showTracking && viewMode === 'stadiums' && (
          <>
            {isLoadingStadiums ? (
              <div className="text-center py-12">Loading stadiums...</div>
            ) : stadiums.length === 0 ? (
              <div className="text-center py-12 text-gray-500">No stadiums available</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {stadiums.map((stadium) => (
                  <StadiumCardShopping
                    key={stadium._id}
                    stadium={stadium}
                    souvenirCount={stadiumSouvenirCounts[stadium.stadiumName] || 0}
                    isSelected={selectedStadium === stadium.stadiumName}
                    onClick={() => handleStadiumClick(stadium.stadiumName)}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* Souvenirs View */}
        {!showTracking && viewMode === 'souvenirs' && (
          <>
            {isLoadingSouvenirs ? (
              <div className="text-center py-12">Loading souvenirs...</div>
            ) : filteredSouvenirs.length === 0 && selectedStadium ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">No souvenirs available for {selectedStadium}</p>
                <Button onClick={handleBackToStadiums}>Back to Stadiums</Button>
              </div>
            ) : filteredSouvenirs.length === 0 && !selectedStadium ? (
              <div className="text-center py-12 text-gray-500">
                Select a stadium to view souvenirs, or switch to "View All Souvenirs" mode
              </div>
            ) : (
              <>
                {selectedStadium && (
                  <div className="mb-6 max-w-3xl  mx-auto rounded-md shadow p-4 bg-[#3b3c5e] text-white">
                    <div className="flex justify-between items-center">
                      <div>
                        <h2 className="text-2xl font-bold">
                          Souvenirs at {selectedStadium}
                        </h2>
                        <p className="text-gray-400 mt-1">
                          {filteredSouvenirs.length} {filteredSouvenirs.length === 1 ? 'item' : 'items'} available
                        </p>
                      </div>
                      <Button onClick={handleBackToStadiums}>
                        <FiX className="inline mr-2" />
                        Back to Stadiums
                      </Button>
                    </div>
                  </div>
                )}
                <div className="gap-4 space-y-2 rounded-md transition p-4 bg-[#3b3c5e] mt-6 w-full max-w-3xl mx-auto">
                     {(selectedStadium ? filteredSouvenirs : souvenirs).map((souvenir) => (
                    <SouvenirCard
                      key={souvenir._id}
                      souvenir={souvenir}
                      showAddToCart={true}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>

      {/* Shopping Cart Modal */}
      <ShoppingCart
        isOpen={showCart}
        onClose={() => setShowCart(false)}
        onCheckoutSuccess={() => {
          setShowCart(false);
          setShowTracking(true);
        }}
      />
    </div>
  );
}

export default ShoppingPage;