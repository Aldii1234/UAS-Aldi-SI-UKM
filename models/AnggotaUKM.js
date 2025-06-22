import mongoose from 'mongoose'

const anggotaSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ukm: { type: mongoose.Schema.Types.ObjectId, ref: 'UKM', required: true },

  // ✅ Data tambahan yang diinput mahasiswa
  nama: { type: String, required: true },
  nim: { type: String, required: true },
  jurusan: { type: String, required: true },

  // ✅ Informasi motivasi dan pengalaman
  alasan: { type: String, required: true },
  pengalaman: { type: String, required: true },

  // ✅ Status persetujuan oleh pengurus
  status: { 
    type: String, 
    enum: ['pending', 'disetujui', 'ditolak'], 
    default: 'pending' 
  },

  createdAt: { type: Date, default: Date.now },
})

export default mongoose.models.AnggotaUKM || mongoose.model('AnggotaUKM', anggotaSchema)
