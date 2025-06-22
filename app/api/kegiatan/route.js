import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Kegiatan from '@/models/Kegiatan'

export async function GET() {
  try {
    await connectDB()

    const kegiatan = await Kegiatan.find()
      .populate('ukmId', 'name')         // tampilkan nama UKM
      .populate('pengurus', 'name email') // tampilkan nama/email pengurus

    return NextResponse.json(kegiatan)
  } catch (err) {
    return NextResponse.json(
      { message: `Gagal memuat kegiatan: ${err.message}` },
      { status: 500 }
    )
  }
}

export async function POST(req) {
  try {
    await connectDB()

    const { judul, deskripsi, tanggal, ukmId, pengurus } = await req.json()

    // Validasi isian wajib
    if (!judul || !deskripsi || !tanggal || !ukmId || !pengurus) {
      return NextResponse.json(
        { message: 'Semua field wajib diisi' },
        { status: 400 }
      )
    }

    const newKegiatan = await Kegiatan.create({
      judul,
      deskripsi,
      tanggal,
      ukmId,
      pengurus,
    })

    return NextResponse.json({
      message: 'Kegiatan berhasil ditambahkan dan menunggu persetujuan admin',
      kegiatan: newKegiatan,
    })
  } catch (err) {
    return NextResponse.json(
      { message: `Gagal menyimpan kegiatan: ${err.message}` },
      { status: 500 }
    )
  }
}
