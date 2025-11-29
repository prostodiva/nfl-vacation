import { useState } from 'react';
import {
  useGetPurchaseHistoryQuery,
  useGetSpendingByStadiumQuery,
  useGetGrandTotalQuery,
  useGetReceiptQuery,
  useClearAllPurchasesMutation
} from '../../store/apis/purchaseApi';
import Button from '../Button';
import { FiDollarSign, FiMapPin, FiShoppingBag, FiFileText } from 'react-icons/fi';
import { FiTrash2 } from 'react-icons/fi'; 

function PurchaseTracking() {
  const [selectedPurchaseId, setSelectedPurchaseId] = useState<string | null>(null);
  const { data: historyData } = useGetPurchaseHistoryQuery();
  const { data: stadiumSpendingData } = useGetSpendingByStadiumQuery();
  const { data: grandTotalData } = useGetGrandTotalQuery();
  const { data: receiptData } = useGetReceiptQuery(selectedPurchaseId || '', {
    skip: !selectedPurchaseId,
  });

  const purchases = historyData?.data || [];
  const stadiumSpending = stadiumSpendingData?.data || [];
  const grandTotal = grandTotalData?.data;

  const [clearAllPurchases, { isLoading: isClearing }] = useClearAllPurchasesMutation();
  const handleClearAll = async () => {
    if (window.confirm('Are you sure you want to clear all purchase tracking data? This cannot be undone.')) {
      try {
        // Clear backend data
        await clearAllPurchases().unwrap();
        
        // Clear localStorage session ID to start fresh
        localStorage.removeItem('shopping_session_id');
        
        // Force page reload to reset all queries
        window.location.reload();
      } catch (error) {
        console.error('Failed to clear data:', error);
        alert('Failed to clear data. Please try again.');
      }
    }
  };

  return (
    <div className="space-y-6">

       {(purchases.length > 0 || stadiumSpending.length > 0) && (
        <div className="mb-6 max-w-3xl mx-auto rounded-md shadow p-4 bg-[#3b3c5e] text-white">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold">Reset Tracking Data</h3>
              <p className="text-sm text-gray-400">Clear all purchase history and start fresh</p>
            </div>
            <Button
              onClick={handleClearAll}
              disabled={isClearing}
              className="text-white"
            >
              <FiTrash2 className="inline mr-2" />
              {isClearing ? 'Clearing...' : 'Clear All Data'}
            </Button>
          </div>
        </div>
      )}
  
      {/* Grand Total Card */}
      {grandTotal && (
        <div className="mb-6 max-w-3xl mx-auto rounded-md shadow p-4 bg-[#3b3c5e] text-white">
          <div className="flex items-center gap-4">
            <FiDollarSign size={40} />
            <div>
              <h3 className="text-xl font-semibold mb-1">Grand Total Spending</h3>
              <p className="text-3xl font-bold">
                ${grandTotal.grandTotal.toFixed(2)}
              </p>
              <p className="text-sm opacity-90 mt-1">
                {grandTotal.totalItems} items across {grandTotal.purchaseCount} purchases
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Spending by Stadium */}
      {stadiumSpending.length > 0 && (
        <div className="mb-6 max-w-3xl mx-auto rounded-md shadow p-4 bg-[#3b3c5e] text-white">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <FiMapPin />
            Spending by Stadium
          </h2>
          <div className="space-y-4">
            {stadiumSpending.map((stadium) => (
              <div
                key={stadium.stadiumName}
                className="border rounded-lg p-4 hover:shadow-md transition"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg">{stadium.stadiumName}</h3>
                  <span className="text-xl font-bold text-[#e93448]">
                    ${stadium.totalSpent.toFixed(2)}
                  </span>
                </div>
                <p className="text-sm text-gray-400 mb-3">
                  {stadium.itemCount} item{stadium.itemCount !== 1 ? 's' : ''}
                </p>
                <div className="space-y-2">
                  {stadium.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between text-sm bg-gray-100 p-2 rounded text-black"
                    >
                      <span>
                        {item.souvenirName} × {item.quantity}
                      </span>
                      <span className="font-semibold">${item.total.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Purchase History */}
      {purchases.length > 0 && (
        <div className="mb-6 max-w-3xl mx-auto rounded-md shadow p-4 bg-[#3b3c5e] text-white">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <FiShoppingBag />
            Purchase History
          </h2>
          <div className="space-y-4">
            {purchases.map((purchase) => (
              <div
                key={purchase._id}
                className="border rounded-lg p-4 hover:shadow-md transition"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-sm text-gray-400">
                      {new Date(purchase.purchaseDate).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-400">
                      {new Date(purchase.purchaseDate).toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-[#e93448]">
                      ${purchase.totalAmount.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600">
                      {purchase.items.length} item{purchase.items.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <div className="space-y-2 mb-3">
                  {purchase.items.map((item) => (
                    <div
                      key={item._id}
                      className="flex justify-between text-sm bg-gray-100 p-2 rounded text-black"
                    >
                      <span>
                        {item.souvenirName} × {item.quantity}
                      </span>
                      <span className="font-semibold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
                <Button
                  onClick={() => setSelectedPurchaseId(purchase._id)}
                  className="w-full"
                >
                  <FiFileText className="inline mr-2" />
                  View Receipt
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {selectedPurchaseId && receiptData?.data && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-2xl font-bold">Receipt</h2>
              <button
                onClick={() => setSelectedPurchaseId(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  Purchase Date: {new Date(receiptData.data.purchaseDate).toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">
                  Receipt ID: {receiptData.data._id}
                </p>
              </div>
              <div className="space-y-2 mb-4">
                {receiptData.data.items.map((item) => (
                  <div
                    key={item._id}
                    className="flex justify-between p-3 border rounded"
                  >
                    <div>
                      <p className="font-semibold">{item.souvenirName}</p>
                      <p className="text-sm text-gray-600">{item.teamName}</p>
                      <p className="text-sm text-gray-600">{item.stadiumName}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-600">
                        ${item.price.toFixed(2)} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between text-xl font-bold">
                  <span>Total:</span>
                  <span className="text-green-600">
                    ${receiptData.data.totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
            <div className="p-6 border-t">
              <Button
                onClick={() => window.print()}
                className="w-full mb-2"
              >
                Print Receipt
              </Button>
              <Button
                onClick={() => setSelectedPurchaseId(null)}
                className="w-full"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {purchases.length === 0 && stadiumSpending.length === 0 && (
        <div className="mb-6 max-w-3xl mx-auto rounded-md shadow p-4 bg-[#3b3c5e] text-white">
          <FiShoppingBag size={48} className="mx-auto mb-4 opacity-50" />
          <p>No purchases yet. Start shopping to track your spending!</p>
        </div>
      )}
    </div>
  );
}

export default PurchaseTracking;