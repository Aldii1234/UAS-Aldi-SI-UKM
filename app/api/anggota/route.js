import connectDB from '@/lib/db'
import AnggotaUKM from '@/models/AnggotaUKM'

export async function GET(req) {
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')

    // Siapkan filter berdasarkan query status jika ada
    const filter = status ? { status } : {}

    const data = await AnggotaUKM.find(filter)
      .populate('user', 'name email')   // tampilkan nama & email user
      .populate('ukm', 'name')          // tampilkan nama UKM

    return Response.json(data)
  } catch (err) {
    return Response.json({ message: err.message }, { status: 500 })
  }
}
