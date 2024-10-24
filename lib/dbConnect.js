// /lib/dbConnect.js

import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/school-crm';

if (!MONGO_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
  
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI).catch(err => {
      console.error('MongoDB connection error:', err);
      throw err; // Rethrow the error after logging it
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
