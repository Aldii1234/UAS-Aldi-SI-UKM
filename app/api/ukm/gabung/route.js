import connectDB from '@/lib/mongodb'
import AnggotaUKM from '@/models/AnggotaUKM'

export async function POST(req) {
  try {
    await connectDB()

    const { ukmId, userId, nama, nim, jurusan, alasan, pengalaman } = await req.json()

    // Validasi input
    if (!ukmId || !userId || !nama || !nim || !jurusan || !alasan || !pengalaman) {
      return new Response(JSON.stringify({ message: 'Semua field wajib diisi.' }), { status: 400 })
    }

    // Cek apakah sudah tergabung sebelumnya
    const already = await AnggotaUKM.findOne({ ukm: ukmId, user: userId })
    if (already) {
      return new Response(JSON.stringify({ message: 'Anda sudah tergabung dalam UKM ini.' }), { status: 400 })
    }

    // Buat anggota baru
    await AnggotaUKM.create({
      ukm: ukmId,
      user: userId,
      nama,
      nim,
      jurusan,
      alasan,
      pengalaman,
      status: 'pending',
    })

    return Response.json({ message: 'Berhasil gabung UKM.' })
  } catch (error) {
    console.error('⨯ Error saat gabung UKM:', error)
    return new Response(JSON.stringify({ message: 'Terjadi kesalahan di server.' }), { status: 500 })
  }
}
