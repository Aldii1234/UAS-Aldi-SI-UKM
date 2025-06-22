import connectDB from '@/lib/db'
import AnggotaUKM from '@/models/AnggotaUKM'

export async function GET(req, { params }) {
  try {
    await connectDB()
    const { id } = params

    const anggota = await AnggotaUKM.findById(id)
      .populate('user', 'name email')
      .populate('ukm', 'name')

    if (!anggota) {
      return Response.json({ message: 'Data anggota tidak ditemukan' }, { status: 404 })
    }

    return Response.json(anggota)
  } catch (err) {
    console.error('[GET ANGGOTA BY ID]', err)
    return Response.json({ message: err.message }, { status: 500 })
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB()
    const { id } = params

    const anggota = await AnggotaUKM.findById(id)
    if (!anggota) {
      return Response.json({ message: 'Data tidak ditemukan' }, { status: 404 })
    }

    if (anggota.status !== 'pending') {
      return Response.json({
        message: 'Pendaftaran sudah diproses dan tidak bisa dibatalkan'
      }, { status: 400 })
    }

    await AnggotaUKM.findByIdAndDelete(id)
    return Response.json({ message: 'Pendaftaran berhasil dibatalkan' })
  } catch (error) {
    console.error('[DELETE ANGGOTA]', error)
    return Response.json({ message: error.message }, { status: 500 })
  }
}
