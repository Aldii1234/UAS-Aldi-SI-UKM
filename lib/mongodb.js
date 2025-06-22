import mongoose from 'mongoose'

let isConnected = false

export default async function connectDB() {
  if (isConnected) return

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'sistem-ukm', // nama database kamu
    })
    isConnected = true
    console.log('✅ MongoDB Connected')
  } catch (error) {
    console.error('❌ MongoDB connection error:', error)
  }
}
