import { writeFile } from 'fs/promises'
import path from 'path'
import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Dokumentasi from '@/models/Dokumentasi'
import UKM from '@/models/UKM'
import User from '@/models/User'

export async function POST(req) {
  try {
    await connectDB()

    // FormData hanya bisa dipakai dengan req.formData()
    const formData = await req.formData()

    const file = formData.get('file')
    const namaKegiatan = formData.get('namaKegiatan')
    const deskripsi = formData.get('deskripsi')
    const pengurus = formData.get('pengurus')
    const ukm = formData.get('ukm')

    // Validasi field
    if (!file || !namaKegiatan || !deskripsi || !pengurus || !ukm) {
      return NextResponse.json({ message: 'Semua field wajib diisi.' }, { status: 400 })
    }

    if (typeof file.name !== 'string' || typeof file.arrayBuffer !== 'function') {
      return NextResponse.json({ message: 'Format file tidak valid.' }, { status: 400 })
    }

    // Konversi file dan simpan ke folder public/uploads/
    const buffer = Buffer.from(await file.arrayBuffer())
    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`
    const filePath = path.join(process.cwd(), 'public', 'uploads', fileName)

    await writeFile(filePath, buffer)

    // Simpan data ke MongoDB
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

export async function GET() {
  try {
    await connectDB()

    const docs = await Dokumentasi.find()
      .populate('ukm', 'name') // pastikan model UKM sudah benar
      .populate('pengurus', 'name') // pastikan model User juga benar
      .sort({ createdAt: -1 })

    return NextResponse.json(docs)
  } catch (err) {
    console.error('[GET Error]', err)
    return NextResponse.json({ message: 'Gagal ambil dokumentasi' }, { status: 500 })
  }
}
