// app/api/peringkat/route.js
import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Kegiatan from '@/models/Kegiatan'
import Vote from '@/models/Voting'
import UKM from '@/models/UKM'

export async function GET() {
  try {
    await connectDB()

    const ukms = await UKM.find().lean()
    const kegiatans = await Kegiatan.find({ status: 'disetujui' }).lean()
    const votes = await Vote.find().lean()

    const peringkatData = ukms.map((ukm) => {
      const kegiatanUKM = kegiatans.filter(k => k.ukmId.toString() === ukm._id.toString())
      const voteUKM = votes.filter(v => kegiatanUKM.some(k => k._id.toString() === v.kegiatan.toString()))

      const totalSetuju = voteUKM.filter(v => v.vote === 'setuju').length
      const totalTidak = voteUKM.filter(v => v.vote === 'tidak').length

      return {
        _id: ukm._id,
        name: ukm.name,
        totalKegiatan: kegiatanUKM.length,
        totalSetuju,
        totalTidak,
        skor: kegiatanUKM.length * 10 + totalSetuju
      }
    })

    // Urutkan berdasarkan skor tertinggi
    peringkatData.sort((a, b) => b.skor - a.skor)

    return NextResponse.json(peringkatData)
  } catch (err) {
    console.error('Gagal ambil peringkat:', err)
    return NextResponse.json({ message: 'Gagal mengambil peringkat UKM' }, { status: 500 })
  }
}
