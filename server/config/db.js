const mongoose = require('mongoose');

let mongodInstance = null;

const connectDB = async () => {
  const defaultUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hospital_management';
  
  try {
    // Attempt standard connection to specified MongoDB server
    console.log(`Connecting to MongoDB at: ${defaultUri} ...`);
    const conn = await mongoose.connect(defaultUri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host} (Database: ${conn.connection.name})`);
    return conn;
  } catch (err) {
    console.warn(`Standard MongoDB connection to ${defaultUri} failed: ${err.message}`);
    console.log('Spinning up automated embedded MongoDB instance via mongodb-memory-server...');

    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongodInstance = await MongoMemoryServer.create({
        instance: {
          port: 27017,
          dbName: 'hospital_management',
        },
      });
      const memoryUri = mongodInstance.getUri();
      console.log(`Embedded MongoDB Server started on: ${memoryUri}`);
      const conn = await mongoose.connect(memoryUri);
      console.log(`MongoDB Connected (Embedded Server): ${conn.connection.host}`);
      return conn;
    } catch (memErr) {
      console.warn(`Could not start embedded on port 27017, trying dynamic port: ${memErr.message}`);
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongodInstance = await MongoMemoryServer.create({
        instance: {
          dbName: 'hospital_management',
        },
      });
      const dynamicUri = mongodInstance.getUri();
      const conn = await mongoose.connect(dynamicUri);
      console.log(`MongoDB Connected (Dynamic Embedded Server): ${dynamicUri}`);
      return conn;
    }
  }
};

const disconnectDB = async () => {
  await mongoose.disconnect();
  if (mongodInstance) {
    await mongodInstance.stop();
  }
};

module.exports = { connectDB, disconnectDB };
