import connectDB from '@/lib/db'
import Vote from '@/models/Voting'

export async function POST(req) {
  try {
    await connectDB()
    const { userId, kegiatanId, vote } = await req.json()

    if (!userId || !kegiatanId || !vote) {
      return new Response(JSON.stringify({ message: 'Semua field wajib diisi.' }), { status: 400 })
    }

    if (!['setuju', 'tidak'].includes(vote)) {
      return new Response(JSON.stringify({ message: 'Vote tidak valid.' }), { status: 400 })
    }

    const existing = await Vote.findOne({ user: userId, kegiatan: kegiatanId })
    if (existing) {
      return new Response(JSON.stringify({ message: 'Anda sudah memberikan suara untuk kegiatan ini.' }), { status: 400 })
    }

    const newVote = await Vote.create({
      user: userId,
      kegiatan: kegiatanId,
      vote
    })

    return Response.json({ message: 'Voting berhasil disimpan.', vote: newVote })
  } catch (err) {
    console.error('⨯ Gagal menyimpan vote:', err)
    return new Response(JSON.stringify({ message: 'Terjadi kesalahan saat menyimpan vote.' }), { status: 500 })
  }
}
