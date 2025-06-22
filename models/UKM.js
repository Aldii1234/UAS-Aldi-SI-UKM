import mongoose from 'mongoose'

const ukmSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  profile: {
    type: String, // atau gunakan `type: mongoose.Schema.Types.Mixed` jika isinya bisa HTML/objek
    default: '',
  },
  visi: {
    type: String,
    default: '',
  },
  misi: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.models.UKM || mongoose.model('UKM', ukmSchema)
