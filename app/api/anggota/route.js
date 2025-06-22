import connectDB from '@/lib/db'
import AnggotaUKM from '@/models/AnggotaUKM'

export async function GET(req) {
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')  // ambil userId dari query
    const status = searchParams.get('status')

    // Validasi
    if (!userId) {
      return Response.json({ message: 'User ID diperlukan' }, { status: 400 })
    }

    // Filter berdasarkan user login dan status (jika ada)
    const filter = { user: userId }
    if (status) filter.status = status

    const data = await AnggotaUKM.find(filter)
      .populate('user', 'name email')   // tampilkan nama & email user
      .populate('ukm', 'name')          // tampilkan nama UKM

    return Response.json(data)
  } catch (err) {
    console.error('[GET ANGGOTA]', err)
    return Response.json({ message: err.message }, { status: 500 })
  }
}
