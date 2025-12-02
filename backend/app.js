//backend - create an express app
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const basicMiddleware = require('./middleware/basic');
const errorHandler = require('./middleware/errorHandler');
const teamRoutes = require('./routes/teamRoutes');
const graphRoutes = require('./routes/graphRoutes');
const customRoutes = require('./routes/customRoutes');
const adminRoutes = require('./routes/adminRoutes');
const stadiumRoutes = require('./routes/stadiumRoutes');
const souvenirRoutes = require('./routes/souvenirsRoutes');
const purchaseRoutes = require('./routes/purchaseRoutes');

require('./models/Distance'); 

const app = express();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/nfl-vacation';

// MongoDB connection
mongoose.connect(MONGODB_URI)
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

// CORS configuration - allow your frontend domain
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:5173', 'http://localhost:3001'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(express.json());
app.use(basicMiddleware);

//Routes
app.use('/api/teams', teamRoutes);
app.use('/api', graphRoutes);
app.use('/api', customRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/stadiums', stadiumRoutes);
app.use('/api/souvenirs', souvenirRoutes);
app.use('/api/purchases', purchaseRoutes);

//test route
app.get('/api/test', (req, res) => {
    res.json({ message: 'Backend is working!' });
});

app.use(errorHandler);

module.exports = app;