import mongoose from 'mongoose'

const ukmSchema = new mongoose.Schema({
  name: String,
  description: String,
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.models.UKM || mongoose.model('UKM', ukmSchema)
