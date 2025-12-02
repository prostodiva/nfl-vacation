import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '../../config/api';
import type {
  AddToCartRequest,
  CartResponse,
  GrandTotalResponse,
  Purchase,
  PurchaseHistoryResponse,
  SpendingByStadiumResponse,
  UpdateCartItemRequest
} from '../types/purchaseTypes';

// Get session ID from localStorage
const getSessionId = (): string => {
  let sessionId = localStorage.getItem('shopping_session_id');
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem('shopping_session_id', sessionId);
  }
  return sessionId;
};

export const purchaseApi = createApi({
  reducerPath: 'purchaseApi',
  baseQuery: fetchBaseQuery({
    baseUrl:  API_BASE_URL ? `${API_BASE_URL}/api/purchases` : '/api/purchases', // Fixed: /api/purchases (plural)
    prepareHeaders: (headers) => {
      const sessionId = getSessionId();
      headers.set('x-session-id', sessionId);
      return headers;
    },
  }),
  tagTypes: ['Cart', 'Purchase'],
  endpoints: (builder) => ({
    // Add to cart
    addToCart: builder.mutation<CartResponse, AddToCartRequest>({
      query: (body) => ({
        url: '/cart',
        method: 'POST',
        body: { ...body, sessionId: getSessionId() },
      }),
      invalidatesTags: ['Cart'],
    }),

    // Get cart
    getCart: builder.query<CartResponse, void>({
      query: () => ({
        url: '/cart',
        params: { sessionId: getSessionId() },
      }),
      providesTags: ['Cart'],
    }),

    // Update cart item
    updateCartItem: builder.mutation<CartResponse, UpdateCartItemRequest>({
      query: (body) => ({
        url: '/cart/item',
        method: 'PUT',
        body: { ...body, sessionId: getSessionId() },
      }),
      invalidatesTags: ['Cart'],
    }),

    // Remove from cart
    removeFromCart: builder.mutation<CartResponse, string>({
      query: (itemId) => ({
        url: `/cart/item/${itemId}`,
        method: 'DELETE',
        params: { sessionId: getSessionId() },
      }),
      invalidatesTags: ['Cart'],
    }),

    // Checkout
    checkout: builder.mutation<CartResponse, void>({
      query: () => ({
        url: '/checkout',
        method: 'POST',
        body: { sessionId: getSessionId() },
      }),
      invalidatesTags: ['Cart', 'Purchase'],
    }),

    // Get purchase history
    getPurchaseHistory: builder.query<PurchaseHistoryResponse, void>({
      query: () => ({
        url: '/history',
        params: { sessionId: getSessionId() },
      }),
      providesTags: ['Purchase'],
    }),

    // Get spending by stadium
    getSpendingByStadium: builder.query<SpendingByStadiumResponse, void>({
      query: () => ({
        url: '/spending-by-stadium',
        params: { sessionId: getSessionId() },
      }),
      providesTags: ['Purchase'],
    }),

    // Get grand total
    getGrandTotal: builder.query<GrandTotalResponse, void>({
      query: () => ({
        url: '/grand-total',
        params: { sessionId: getSessionId() },
      }),
      providesTags: ['Purchase'],
    }),

    // Get receipt
    getReceipt: builder.query<{ success: boolean; data: Purchase }, string>({
      query: (purchaseId) => ({
        url: `/receipt/${purchaseId}`,
        params: { sessionId: getSessionId() },
      }),
      providesTags: ['Purchase'],
    }),

    clearAllPurchases: builder.mutation<{ success: boolean; message: string; deletedCount: number }, void>({
      query: () => ({
        url: '/clear-all',
        method: 'DELETE',
        body: { sessionId: getSessionId() },
      }),
      invalidatesTags: ['Cart', 'Purchase'],
    }),
  }),
});

export const {
  useAddToCartMutation,
  useGetCartQuery,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
  useCheckoutMutation,
  useGetPurchaseHistoryQuery,
  useGetSpendingByStadiumQuery,
  useGetGrandTotalQuery,
  useGetReceiptQuery,
  useClearAllPurchasesMutation
} = purchaseApi;