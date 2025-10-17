const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  teamName: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  conference: {
    type: String,
    required: true,
    enum: ['AFC', 'NFC']
  },
  division: {
    type: String,
    required: true,
    enum: ['AFC East', 'AFC West', 'AFC North', 'AFC South', 
           'NFC East', 'NFC West', 'NFC North', 'NFC South']
  },
  stadium: {
    name: { 
      type: String, 
      required: true,
      trim: true
    },
    location: { 
      type: String, 
      required: true,
      trim: true
    },
    seatingCapacity: { 
      type: Number, 
      required: true,
      min: 0
    },
    surfaceType: { 
      type: String, 
      required: true,
      trim: true
    },
    roofType: { 
      type: String, 
      required: true,
      enum: ['Open', 'Dome', 'Retractable']
    },
    yearOpened: { 
      type: Number, 
      required: true,
      min: 1800,
      max: 2030
    }
  },
  souvenirs: [{
    name: { 
      type: String, 
      required: true,
      trim: true
    },
    price: { 
      type: Number, 
      required: true,
      min: 0
    },
    category: { 
      type: String, 
      required: true,
      enum: ['Apparel', 'Accessories', 'Collectibles', 'Food & Beverage']
    },
    isTraditional: { 
      type: Boolean, 
      default: true
    }
  }]
}, {
  timestamps: true
});

// Indexes for better performance
teamSchema.index({ teamName: 1 });
teamSchema.index({ conference: 1 });
teamSchema.index({ division: 1 });
teamSchema.index({ 'stadium.name': 1 });

module.exports = mongoose.model('Team', teamSchema);