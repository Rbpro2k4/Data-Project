const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // Remove these options as they're deprecated or not supported
      // ssl: true,
      // sslValidate: true,
      // tlsAllowInvalidCertificates: false,
      // tlsAllowInvalidHostnames: false,
      retryWrites: true,
      w: 'majority'
    });
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    // Add error handlers for the connection
    mongoose.connection.on('error', err => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

  } catch (err) {
    console.error(`❌ MongoDB Connection Error: ${err.message}`);
    console.error('Full error:', err);
    process.exit(1);
  }
};

module.exports = connectDB;
