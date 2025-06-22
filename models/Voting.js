import mongoose from 'mongoose'
const { Schema } = mongoose

const voteSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  kegiatan: { type: mongoose.Schema.Types.ObjectId, ref: 'Kegiatan', required: true },
  vote: { type: String, enum: ['setuju', 'tidak'], required: true }
}, { timestamps: true })

export default mongoose.models.Vote || mongoose.model('Vote', voteSchema)
