const mongoose = require('mongoose');

const distanceSchema = new mongoose.Schema({
  teamName: {
    type: String,
    required: true,
    trim: true
  },
  beginningStadium: {
    type: String,
    required: true,
    trim: true
  },
  endingStadium: {
    type: String,
    required: true,
    trim: true
  },
  distance: {
    type: Number,
    required: true,
    min: 0
  }
}, {
  timestamps: true
});

// Indexes for better performance
distanceSchema.index({ teamName: 1 });
distanceSchema.index({ beginningStadium: 1 });
distanceSchema.index({ endingStadium: 1 });
distanceSchema.index({ beginningStadium: 1, endingStadium: 1 });

module.exports = mongoose.model('Distance', distanceSchema);