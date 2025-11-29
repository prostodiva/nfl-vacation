const express = require('express');
const {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
  checkout,
  getPurchaseHistory,
  getSpendingByStadium,
  getGrandTotal,
  getReceipt,
  clearAllPurchases
} = require('../controllers/purchaseService');

const router = express.Router();

router.post('/cart', addToCart);
router.get('/cart', getCart);
router.put('/cart/item', updateCartItem);
router.delete('/cart/item/:itemId', removeFromCart);
router.post('/checkout', checkout);
router.get('/history', getPurchaseHistory);
router.get('/spending-by-stadium', getSpendingByStadium);
router.get('/grand-total', getGrandTotal);
router.get('/receipt/:purchaseId', getReceipt);
router.delete('/clear-all', clearAllPurchases);

module.exports = router;