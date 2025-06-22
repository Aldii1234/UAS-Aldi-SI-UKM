import mongoose from 'mongoose'

const dokumentasiSchema = new mongoose.Schema({
  namaKegiatan: { type: String, required: true },
  deskripsi: { type: String, required: true },
  filePath: { type: String, required: true },
  pengurus: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // pastikan kamu punya models/User.js
    required: true,
  },
  ukm: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UKM', // ✅ inilah yang diperlukan agar populate('ukm') jalan
    required: true,
  },
}, { timestamps: true })

export default mongoose.models.Dokumentasi || mongoose.model('Dokumentasi', dokumentasiSchema)
