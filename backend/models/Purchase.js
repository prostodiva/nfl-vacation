const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
    sessionId: {
        type: String,
        required: true,
        index: true
    },
    items: [{
        souvenirId: {
            type: String,
            required: true
        },
        souvenirName: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true,
            min: 0
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
            default: 1
            },
            stadiumName: {
            type: String,
            required: true
            },
            teamName: {
            type: String,
            required: true
            },
            category: {
            type: String,
            required: true
            }
            }],
        totalAmount: {
        type: Number,
        required: true,
        min: 0
    },
    purchaseDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['pending', 'completed'],
        default: 'completed'
    }
}, {
    timestamps: true
});


// Indexes for better performance
purchaseSchema.index({ sessionId: 1, purchaseDate: -1 });
purchaseSchema.index({ 'items.stadiumName': 1 });

module.exports = mongoose.model('Purchase', purchaseSchema);