import mongoose from 'mongoose'

const kegiatanSchema = new mongoose.Schema({
  judul: { type: String, required: true },
  deskripsi: { type: String, required: true },
  tanggal: { type: Date, required: true },
  ukmId: { type: mongoose.Schema.Types.ObjectId, ref: 'UKM', required: true },
  pengurus: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'disetujui', 'ditolak'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.models.Kegiatan || mongoose.model('Kegiatan', kegiatanSchema)
