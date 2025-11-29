export interface CartItem {
  _id: string;
  souvenirId: string;
  souvenirName: string;
  price: number;
  quantity: number;
  stadiumName: string;
  teamName: string;
  category: string;
}

export interface Purchase {
  _id: string;
  sessionId: string;
  items: CartItem[];
  totalAmount: number;
  purchaseDate: string;
  status: 'pending' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface CartResponse {
  success: boolean;
  data: Purchase | null;
  sessionId?: string;
  message?: string;
}

export interface PurchaseHistoryResponse {
  success: boolean;
  count: number;
  data: Purchase[];
}

export interface StadiumSpending {
  stadiumName: string;
  totalSpent: number;
  itemCount: number;
  items: Array<{
    souvenirName: string;
    quantity: number;
    price: number;
    total: number;
  }>;
}

export interface SpendingByStadiumResponse {
  success: boolean;
  count: number;
  data: StadiumSpending[];
}

export interface GrandTotalResponse {
  success: boolean;
  data: {
    grandTotal: number;
    totalItems: number;
    purchaseCount: number;
  };
}

export interface AddToCartRequest {
  souvenirId: string;
  quantity?: number;
  sessionId?: string;
}

export interface UpdateCartItemRequest {
  itemId: string;
  quantity: number;
  sessionId?: string;
}