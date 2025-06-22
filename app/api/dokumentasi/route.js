import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Dokumentasi from '@/models/Dokumentasi'
import UKM from '@/models/UKM'
import User from '@/models/User'
import { writeFile } from 'fs/promises'
import path from 'path'

export async function GET() {
  try {
    await connectDB()

    const docs = await Dokumentasi.find()
      .populate('ukm', 'name')
      .populate('pengurus', 'name')
      .sort({ createdAt: -1 })

    // ✅ Berhasil: return list dokumentasi dalam JSON
    return NextResponse.json(docs)
  } catch (err) {
    console.error('[GET Error]', err)
    // ✅ Gagal: tetap return response JSON valid
    return NextResponse.json({ message: 'Gagal ambil dokumentasi', error: err.message }, { status: 500 })
  }
}

export async function POST(req) {
  try {
    await connectDB()
    const formData = await req.formData()

    const file = formData.get('file')
    const namaKegiatan = formData.get('namaKegiatan')
    const deskripsi = formData.get('deskripsi')
    const pengurus = formData.get('pengurus')
    const ukm = formData.get('ukm')

    if (!file || !namaKegiatan || !deskripsi || !pengurus || !ukm) {
      return NextResponse.json({ message: 'Semua field wajib diisi.' }, { status: 400 })
    }

    if (typeof file.name !== 'string' || typeof file.arrayBuffer !== 'function') {
      return NextResponse.json({ message: 'Format file tidak valid.' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`
    const filePath = path.join(process.cwd(), 'public', 'uploads', fileName)
    await writeFile(filePath, buffer)

    const saved = await Dokumentasi.create({
      namaKegiatan,
      deskripsi,
      pengurus,
      ukm,
      filePath: `/uploads/${fileName}`,
    })

    return NextResponse.json({ message: 'Berhasil upload', data: saved })
  } catch (err) {
    console.error('[Upload Error]', err)
    return NextResponse.json({ message: 'Upload gagal', error: err.message }, { status: 500 })
  }
}
