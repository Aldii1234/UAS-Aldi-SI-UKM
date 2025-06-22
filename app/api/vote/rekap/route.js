// app/api/vote/rekap/route.js
import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Vote from '@/models/Voting'
import Kegiatan from '@/models/Kegiatan'
import UKM from '@/models/UKM'

export async function GET() {
  try {
    await connectDB()

    const kegiatan = await Kegiatan.find().populate('ukmId', 'name').lean()
    const allVotes = await Vote.find().lean()

    const kegiatanWithVotes = kegiatan.map((keg) => {
      const votes = allVotes.filter(
        v => v.kegiatan && v.kegiatan.toString() === keg._id.toString()
      )

      const setuju = votes.filter(v => v.vote === 'setuju').length
      const tidak = votes.filter(v => v.vote === 'tidak').length

      return {
        ...keg,
        setuju,
        tidak,
      }
    })

    return NextResponse.json(kegiatanWithVotes)
  } catch (err) {
    console.error('⨯ Gagal mengambil rekap vote:', err)
    return NextResponse.json({ message: 'Gagal mengambil rekap vote' }, { status: 500 })
  }
}
