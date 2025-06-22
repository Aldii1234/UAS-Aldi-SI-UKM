'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'
import Link from 'next/link'

export default function AdminDashboard() {
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) {
      const parsed = JSON.parse(stored)
      if (parsed.role === 'admin') {
        setUser(parsed)
      } else {
        Swal.fire('Akses Ditolak', 'Anda bukan admin.', 'warning')
        router.push('/login')
      }
    } else {
      Swal.fire('Akses Ditolak', 'Silakan login terlebih dahulu.', 'warning')
      router.push('/login')
    }
  }, [])

  if (!user) return null

  return (
    <main className="min-h-screen bg-sky-50 p-6 flex justify-center items-start">
      <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-3xl">
        <h1 className="text-2xl font-bold text-sky-700 mb-2">
          Selamat Datang, {user.name} 👨‍💼
        </h1>
        <p className="text-gray-600 mb-6">
          Anda login sebagai <span className="font-semibold">{user.role}</span>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Lihat Semua UKM */}
          <Link href="/dashboard/admin/ukm">
            <div className="bg-sky-100 hover:bg-sky-200 p-6 rounded-lg shadow cursor-pointer">
              <h2 className="text-lg font-semibold text-sky-800 mb-2">Lihat Semua UKM</h2>
              <p className="text-sm text-gray-600">Kelola data seluruh Unit Kegiatan Mahasiswa yang terdaftar.</p>
            </div>
          </Link>

          {/* Tambah UKM */}
          <Link href="/dashboard/admin/ukm/tambah">
            <div className="bg-blue-100 hover:bg-blue-200 p-6 rounded-lg shadow cursor-pointer">
              <h2 className="text-lg font-semibold text-blue-800 mb-2">Tambah UKM</h2>
              <p className="text-sm text-gray-600">Tambahkan Unit Kegiatan Mahasiswa baru ke sistem.</p>
            </div>
          </Link>

          {/* Monitoring Peringkat */}
          <Link href="/dashboard/admin/peringkat">
            <div className="bg-orange-100 hover:bg-orange-200 p-6 rounded-lg shadow cursor-pointer">
              <h2 className="text-lg font-semibold text-orange-800 mb-2">Monitoring Peringkat</h2>
              <p className="text-sm text-gray-600">Pantau peringkat UKM berdasarkan kegiatan dan partisipasi.</p>
            </div>
          </Link>

          {/* Approve Kegiatan */}
          <Link href="/dashboard/admin/approve-kegiatan">
            <div className="bg-green-100 hover:bg-green-200 p-6 rounded-lg shadow cursor-pointer">
              <h2 className="text-lg font-semibold text-green-800 mb-2">Approve Kegiatan</h2>
              <p className="text-sm text-gray-600">Tinjau dan setujui kegiatan yang diajukan oleh pengurus UKM.</p>
            </div>
          </Link>
        </div>

        <div className="mt-8">
          <button
            onClick={() => {
              localStorage.removeItem('user')
              router.push('/login')
            }}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    </main>
  )
}
