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

const app = express();

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/nfl-vacation', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

app.use(cors());
app.use(express.json());
app.use(basicMiddleware);

//Routes
app.use('/api/teams', teamRoutes);
app.use('/api', graphRoutes);
app.use('/api', customRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/stadiums', stadiumRoutes);

//test route
app.get('/api/test', (req, res) => {
    res.json({ message: 'Backend is working!' });
});

app.use(errorHandler);

module.exports = app;