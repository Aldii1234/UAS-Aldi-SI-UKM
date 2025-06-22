import connectDB from '@/lib/db'
import AnggotaUKM from '@/models/AnggotaUKM'

export async function GET(req) {
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')
    const status = searchParams.get('status')

    const filter = {}
    if (userId) filter.user = userId
    if (status) filter.status = status

    const data = await AnggotaUKM.find(filter)
      .populate('user', 'name email')
      .populate('ukm', 'name')

    return Response.json(data)
  } catch (err) {
    console.error('[GET ANGGOTA]', err)
    return Response.json({ message: err.message }, { status: 500 })
  }
}
