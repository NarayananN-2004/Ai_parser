import mongoose from 'mongoose';

let isConnected = false;

export async function connectDB() {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/aiparser';

  try {
    mongoose.set('strictQuery', false);
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500, // Quick timeout if local mongo isn't up
    });
    isConnected = true;
    console.log(`✅ MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return true;
  } catch (error) {
    console.warn(`⚠️ MongoDB Connection Notice: Could not connect to ${uri}. (${error.message})`);
    console.warn('ℹ️ Running with graceful fallback storage so endpoints remain operational.');
    isConnected = false;
    return false;
  }
}

export function getDBStatus() {
  return isConnected;
}
