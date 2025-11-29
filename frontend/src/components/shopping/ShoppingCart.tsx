import { useGetCartQuery, useUpdateCartItemMutation, useRemoveFromCartMutation, useCheckoutMutation } from '../../store/apis/purchaseApi';
import Button from '../Button';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { FiShoppingCart } from 'react-icons/fi';

interface ShoppingCartProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckoutSuccess?: () => void;
}

function ShoppingCart({ isOpen, onClose, onCheckoutSuccess }: ShoppingCartProps) {
  const { data: cartData, isLoading } = useGetCartQuery();
  const [updateCartItem] = useUpdateCartItemMutation();
  const [removeFromCart] = useRemoveFromCartMutation();
  const [checkout, { isLoading: isCheckingOut }] = useCheckoutMutation();

  const cart = cartData?.data;
  const items = cart?.items || [];

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      await removeFromCart(itemId);
    } else {
      await updateCartItem({ itemId, quantity: newQuantity });
    }
  };

  const handleCheckout = async () => {
    try {
      await checkout().unwrap();
      onCheckoutSuccess?.();
      onClose();
    } catch (error) {
      console.error('Checkout failed:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FiShoppingCart />
            Shopping Cart
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="text-center py-8">Loading cart...</div>
          ) : items.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Your cart is empty
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.souvenirName}</h3>
                    <p className="text-sm text-gray-600">{item.teamName}</p>
                    <p className="text-sm text-gray-500">{item.stadiumName}</p>
                    <p className="text-lg font-bold text-green-600 mt-2">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                        className="w-8 h-8 rounded border hover:bg-gray-100"
                      >
                        −
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                        className="w-8 h-8 rounded border hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="text-red-500 hover:text-red-700 p-2"
                    >
                      <RiDeleteBin6Line size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart && items.length > 0 && (
          <div className="p-6 border-t bg-gray-50">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xl font-semibold">Total:</span>
              <span className="text-2xl font-bold text-green-600">
                ${cart.totalAmount.toFixed(2)}
              </span>
            </div>
            <Button
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="w-full"
            >
              {isCheckingOut ? 'Processing...' : 'Checkout'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ShoppingCart;