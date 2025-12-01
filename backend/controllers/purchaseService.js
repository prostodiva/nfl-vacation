/**
 * @fileoverview Purchase service controller - Handles shopping cart and purchase operations
 * @module purchaseService
 */

const Purchase = require('../models/Purchase');
const Team = require('../models/Team');
const { v4: uuidv4 } = require('uuid');

/**
 * Generate or get session ID from request
 * Checks headers first, then body, then generates new UUID
 * 
 * @param {Object} req - Express request object
 * @returns {string} Session ID
 * @private
 */
const getSessionId = (req) => {
  return req.headers['x-session-id'] || req.body.sessionId || uuidv4();
};

/**
 * Add item to cart
 * Creates a new cart or adds/updates item in existing pending cart
 * Automatically increments quantity if item already exists
 * 
 * @route POST /api/purchases/add-to-cart
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body
 * @param {string} req.body.souvenirId - ID of souvenir to add
 * @param {number} [req.body.quantity=1] - Quantity to add
 * @param {string} [req.body.sessionId] - Optional session ID (generated if not provided)
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with success status, cart data, and sessionId
 * @example
 * // Request: POST /api/purchases/add-to-cart
 * // Body: { souvenirId: '...', quantity: 2 }
 * // Response:
 * {
 *   success: true,
 *   data: { /* cart object *\/ },
 *   sessionId: 'uuid-here'
 * }
 */
const addToCart = async (req, res) => {
  try {
    const { souvenirId, quantity = 1 } = req.body;
    const sessionId = getSessionId(req);

    // Find the souvenir
    const teams = await Team.find({ 'souvenirs._id': souvenirId });
    let souvenir = null;
    let team = null;

    for (const t of teams) {
      const s = t.souvenirs.id(souvenirId);
      if (s) {
        souvenir = s;
        team = t;
        break;
      }
    }

    if (!souvenir || !team) {
      return res.status(404).json({
        success: false,
        message: 'Souvenir not found'
      });
    }

    // Find or create pending cart
    let cart = await Purchase.findOne({ 
      sessionId, 
      status: 'pending' 
    });

    if (!cart) {
      cart = new Purchase({
        sessionId,
        items: [],
        totalAmount: 0,
        status: 'pending'
      });
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.souvenirId === souvenirId
    );

    if (existingItemIndex >= 0) {
      // Update quantity
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({
        souvenirId: souvenirId,
        souvenirName: souvenir.name,
        price: souvenir.price,
        quantity: quantity,
        stadiumName: team.stadium?.name || 'N/A',
        teamName: team.teamName,
        category: souvenir.category
      });
    }

    // Recalculate total
    cart.totalAmount = cart.items.reduce(
      (sum, item) => sum + (item.price * item.quantity), 
      0
    );

    await cart.save();

    res.status(200).json({
      success: true,
      data: cart,
      sessionId: cart.sessionId
    });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding item to cart',
      error: error.message
    });
  }
};

const getCart = async (req, res) => {
  try {
    const sessionId = req.headers['x-session-id'] || req.query.sessionId;

    if (!sessionId) {
      return res.status(200).json({
        success: true,
        data: null,
        message: 'No cart found'
      });
    }

    const cart = await Purchase.findOne({ 
      sessionId, 
      status: 'pending' 
    });

    res.status(200).json({
      success: true,
      data: cart || null
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching cart',
      error: error.message
    });
  }
};

/**
 * Update cart item quantity
 * Updates the quantity of an item in the cart
 * 
 * @route PUT /api/purchases/update-cart/:itemId
 * @param {Object} req - Express request object
 * @param {Object} req.params - Request parameters
 * @param {string} req.params.itemId - Cart item ID to update
 * @param {Object} req.body - Request body
 * @param {number} req.body.quantity - New quantity
 * @param {string} [req.body.sessionId] - Session ID
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with success status and updated cart data
 */
const updateCartItem = async (req, res) => {
  try {
    const { itemId, quantity } = req.body;
    const sessionId = req.headers['x-session-id'] || req.body.sessionId;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: 'Session ID required'
      });
    }

    const cart = await Purchase.findOne({ 
      sessionId, 
      status: 'pending' 
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    const item = cart.items.id(itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      });
    }

    if (quantity <= 0) {
      // Remove item if quantity is 0 or less
      cart.items.pull(itemId);
    } else {
      item.quantity = quantity;
    }

    // Recalculate total
    cart.totalAmount = cart.items.reduce(
      (sum, item) => sum + (item.price * item.quantity), 
      0
    );

    await cart.save();

    res.status(200).json({
      success: true,
      data: cart
    });
  } catch (error) {
    console.error('Error updating cart item:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating cart item',
      error: error.message
    });
  }
};

/**
 * Remove item from cart
 * Removes an item from the shopping cart
 * 
 * @route DELETE /api/purchases/remove-from-cart/:itemId
 * @param {Object} req - Express request object
 * @param {Object} req.params - Request parameters
 * @param {string} req.params.itemId - Cart item ID to remove
 * @param {string} [req.headers['x-session-id']] - Session ID from header
 * @param {string} [req.query.sessionId] - Session ID from query parameter
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with success status and updated cart data
 */
const removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;
    const sessionId = req.headers['x-session-id'] || req.query.sessionId;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: 'Session ID required'
      });
    }

    const cart = await Purchase.findOne({ 
      sessionId, 
      status: 'pending' 
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    cart.items.pull(itemId);
    cart.totalAmount = cart.items.reduce(
      (sum, item) => sum + (item.price * item.quantity), 
      0
    );

    await cart.save();

    res.status(200).json({
      success: true,
      data: cart
    });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing item from cart',
      error: error.message
    });
  }
};

/**
 * Checkout (complete purchase)
 * Completes a purchase by changing cart status from 'pending' to 'completed'
 * 
 * @route POST /api/purchases/checkout
 * @param {Object} req - Express request object
 * @param {string} [req.headers['x-session-id']] - Session ID from header
 * @param {string} [req.body.sessionId] - Session ID from body
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with success status and completed purchase data
 */
const checkout = async (req, res) => {
  try {
    const sessionId = req.headers['x-session-id'] || req.body.sessionId;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: 'Session ID required'
      });
    }

    const cart = await Purchase.findOne({ 
      sessionId, 
      status: 'pending' 
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }

    cart.status = 'completed';
    cart.purchaseDate = new Date();
    await cart.save();

    res.status(200).json({
      success: true,
      data: cart,
      message: 'Purchase completed successfully'
    });
  } catch (error) {
    console.error('Error during checkout:', error);
    res.status(500).json({
      success: false,
      message: 'Error during checkout',
      error: error.message
    });
  }
};

/**
 * Get purchase history
 * Retrieves all completed purchases for a session
 * 
 * @route GET /api/purchases/history
 * @param {Object} req - Express request object
 * @param {string} [req.headers['x-session-id']] - Session ID from header
 * @param {string} [req.query.sessionId] - Session ID from query parameter
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with success status, count, and purchase history
 */
const getPurchaseHistory = async (req, res) => {
  try {
    const sessionId = req.headers['x-session-id'] || req.query.sessionId;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: 'Session ID required'
      });
    }

    const purchases = await Purchase.find({ 
      sessionId, 
      status: 'completed' 
    }).sort({ purchaseDate: -1 });

    res.status(200).json({
      success: true,
      count: purchases.length,
      data: purchases
    });
  } catch (error) {
    console.error('Error fetching purchase history:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching purchase history',
      error: error.message
    });
  }
};

/**
 * Get spending summary by stadium
 * Calculates total spending grouped by stadium for a session
 * 
 * @route GET /api/purchases/spending-by-stadium
 * @param {Object} req - Express request object
 * @param {string} [req.headers['x-session-id']] - Session ID from header
 * @param {string} [req.query.sessionId] - Session ID from query parameter
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with success status and spending summary by stadium
 */
const getSpendingByStadium = async (req, res) => {
  try {
    const sessionId = req.headers['x-session-id'] || req.query.sessionId;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: 'Session ID required'
      });
    }

    const purchases = await Purchase.find({ 
      sessionId, 
      status: 'completed' 
    });

    // Calculate spending by stadium
    const stadiumSpending = {};
    purchases.forEach(purchase => {
      purchase.items.forEach(item => {
        const stadium = item.stadiumName;
        if (!stadiumSpending[stadium]) {
          stadiumSpending[stadium] = {
            stadiumName: stadium,
            totalSpent: 0,
            itemCount: 0,
            items: []
          };
        }
        const itemTotal = item.price * item.quantity;
        stadiumSpending[stadium].totalSpent += itemTotal;
        stadiumSpending[stadium].itemCount += item.quantity;
        stadiumSpending[stadium].items.push({
          souvenirName: item.souvenirName,
          quantity: item.quantity,
          price: item.price,
          total: itemTotal
        });
      });
    });

    const summary = Object.values(stadiumSpending);

    res.status(200).json({
      success: true,
      count: summary.length,
      data: summary
    });
  } catch (error) {
    console.error('Error calculating spending by stadium:', error);
    res.status(500).json({
      success: false,
      message: 'Error calculating spending by stadium',
      error: error.message
    });
  }
};

/**
 * Get grand total spending
 * Calculates total spending and item count across all purchases for a session
 * 
 * @route GET /api/purchases/grand-total
 * @param {Object} req - Express request object
 * @param {string} [req.headers['x-session-id']] - Session ID from header
 * @param {string} [req.query.sessionId] - Session ID from query parameter
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with success status, grand total, and total items
 */
const getGrandTotal = async (req, res) => {
  try {
    const sessionId = req.headers['x-session-id'] || req.query.sessionId;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: 'Session ID required'
      });
    }

    const purchases = await Purchase.find({ 
      sessionId, 
      status: 'completed' 
    });

    const grandTotal = purchases.reduce(
      (sum, purchase) => sum + purchase.totalAmount, 
      0
    );

    const totalItems = purchases.reduce(
      (sum, purchase) => sum + purchase.items.reduce(
        (itemSum, item) => itemSum + item.quantity, 
        0
      ), 
      0
    );

    res.status(200).json({
      success: true,
      data: {
        grandTotal,
        totalItems,
        purchaseCount: purchases.length
      }
    });
  } catch (error) {
    console.error('Error calculating grand total:', error);
    res.status(500).json({
      success: false,
      message: 'Error calculating grand total',
      error: error.message
    });
  }
};

/**
 * Get purchase receipt
 * Retrieves a specific completed purchase receipt by ID
 * 
 * @route GET /api/purchases/receipt/:purchaseId
 * @param {Object} req - Express request object
 * @param {Object} req.params - Request parameters
 * @param {string} req.params.purchaseId - Purchase ID
 * @param {string} [req.headers['x-session-id']] - Session ID from header
 * @param {string} [req.query.sessionId] - Session ID from query parameter
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with success status and purchase receipt data
 */
const getReceipt = async (req, res) => {
  try {
    const { purchaseId } = req.params;
    const sessionId = req.headers['x-session-id'] || req.query.sessionId;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: 'Session ID required'
      });
    }

    const purchase = await Purchase.findOne({ 
      _id: purchaseId,
      sessionId,
      status: 'completed' 
    });

    if (!purchase) {
      return res.status(404).json({
        success: false,
        message: 'Purchase not found'
      });
    }

    res.status(200).json({
      success: true,
      data: purchase
    });
  } catch (error) {
    console.error('Error fetching receipt:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching receipt',
      error: error.message
    });
  }
};

// Clear all purchases for a session
const clearAllPurchases = async (req, res) => {
  try {
    const sessionId = req.headers['x-session-id'] || req.body.sessionId;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: 'Session ID required'
      });
    }

    // Delete all purchases (both pending and completed) for this session
    const result = await Purchase.deleteMany({ sessionId });

    res.status(200).json({
      success: true,
      message: 'All purchase data cleared',
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Error clearing purchases:', error);
    res.status(500).json({
      success: false,
      message: 'Error clearing purchase data',
      error: error.message
    });
  }
};

module.exports = {
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
};