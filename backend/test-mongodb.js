const mongoose = require('mongoose');

// MongoDB connection string
const MONGODB_URI = 'mongodb://localhost:27017/test-database';

async function testMongoDB() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Successfully connected to MongoDB!');
    
    // Test creating a simple document
    const TestSchema = new mongoose.Schema({
      name: String,
      message: String,
      timestamp: { type: Date, default: Date.now }
    });
    
    const TestModel = mongoose.model('Test', TestSchema);
    
    // Create a test document
    const testDoc = new TestModel({
      name: 'Test User',
      message: 'MongoDB is working!'
    });
    
    await testDoc.save();
    console.log('✅ Successfully created test document:', testDoc);
    
    // Find the document
    const foundDoc = await TestModel.findOne({ name: 'Test User' });
    console.log('✅ Successfully retrieved document:', foundDoc);
    
    // Clean up - delete the test document
    await TestModel.deleteOne({ name: 'Test User' });
    console.log('✅ Successfully cleaned up test document');
    
    console.log('🎉 MongoDB test completed successfully!');
    
  } catch (error) {
    console.error('❌ MongoDB test failed:', error.message);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
  }
}

// Run the test
testMongoDB(); 