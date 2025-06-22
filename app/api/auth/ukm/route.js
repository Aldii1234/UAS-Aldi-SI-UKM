import connectDB from '@/lib/mongodb'
import UKM from '@/models/UKM'

export async function GET() {
  await connectDB()
  const ukms = await UKM.find()
  return Response.json(ukms)
}
