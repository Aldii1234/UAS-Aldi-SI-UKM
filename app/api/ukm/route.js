import connectDB from '@/lib/mongodb'
import UKM from '@/models/UKM'

export async function GET() {
  try {
    await connectDB()
    const ukms = await UKM.find()
    return Response.json(ukms)
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Gagal mengambil data UKM.' }), {
      status: 500,
    })
  }
}

export async function POST(req) {
  try {
    await connectDB()
    const { name, description } = await req.json()

    if (!name || !description) {
      return new Response(JSON.stringify({ message: 'Semua field wajib diisi.' }), {
        status: 400,
      })
    }

    const newUkm = await UKM.create({ name, description })
    return new Response(JSON.stringify(newUkm), { status: 201 })
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Gagal menambahkan UKM.' }), {
      status: 500,
    })
  }
}
