import connectDB from '@/lib/db'
import AnggotaUKM from '@/models/AnggotaUKM'

// Handler PUT untuk mengubah status anggota
export async function PUT(req, { params }) {
  try {
    await connectDB()
    const { id } = params
    const { status } = await req.json()

    const allowed = ['pending', 'disetujui', 'ditolak']
    if (!allowed.includes(status)) {
      return Response.json({ message: 'Status tidak valid' }, { status: 400 })
    }

    const anggota = await AnggotaUKM.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    )

    if (!anggota) {
      return Response.json({ message: 'Anggota tidak ditemukan' }, { status: 404 })
    }

    return Response.json({ message: 'Status berhasil diperbarui', data: anggota })
  } catch (err) {
    return Response.json({ message: err.message }, { status: 500 })
  }
}

// Handler DELETE untuk membatalkan pendaftaran (jika masih pending)
export async function DELETE(req, { params }) {
  const { id } = params
  try {
    await connectDB()

    const anggota = await AnggotaUKM.findById(id)
    if (!anggota) {
      return Response.json({ message: 'Data tidak ditemukan' }, { status: 404 })
    }

    if (anggota.status !== 'pending') {
      return Response.json({ message: 'Pendaftaran sudah diproses dan tidak bisa dibatalkan' }, { status: 400 })
    }

    await AnggotaUKM.findByIdAndDelete(id)
    return Response.json({ message: 'Pendaftaran berhasil dibatalkan' })
  } catch (error) {
    return Response.json({ message: error.message }, { status: 500 })
  }
}
