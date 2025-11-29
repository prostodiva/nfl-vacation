const Purchase = require('../models/Purchase');
const Team = require('../models/Team');
const { v4: uuidv4 } = require('uuid');

// Generate or get session ID
const getSessionId = (req) => {
  return req.headers['x-session-id'] || req.body.sessionId || uuidv4();
};

// Add item to cart (creates or updates cart)
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

// Get current cart
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

// Update cart item quantity
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

// Remove item from cart
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

// Checkout (complete purchase)
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

// Get purchase history
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

// Get spending summary by stadium
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

// Get grand total spending
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

// Get purchase receipt
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