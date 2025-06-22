import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Dokumentasi from '@/models/Dokumentasi'
import cloudinary from '@/lib/cloudinary'
import streamifier from 'streamifier'

export async function GET() {
  try {
    await connectDB()

    const docs = await Dokumentasi.find()
      .populate('ukm', 'name')
      .populate('pengurus', 'name')
      .sort({ createdAt: -1 })

    return NextResponse.json(docs)
  } catch (err) {
    console.error('[GET Error]', err)
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

    const buffer = Buffer.from(await file.arrayBuffer())

    const uploadToCloudinary = () =>
      new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'ukm_dokumentasi',
          },
          (error, result) => {
            if (error) return reject(error)
            resolve(result)
          }
        )

        streamifier.createReadStream(buffer).pipe(uploadStream)
      })

    const result = await uploadToCloudinary()

    const saved = await Dokumentasi.create({
      namaKegiatan,
      deskripsi,
      pengurus,
      ukm,
      filePath: result.secure_url,
    })

    return NextResponse.json({ message: 'Berhasil upload', data: saved })
  } catch (err) {
    console.error('[Upload Error]', err)
    return NextResponse.json({ message: 'Upload gagal', error: err.message }, { status: 500 })
  }
}
