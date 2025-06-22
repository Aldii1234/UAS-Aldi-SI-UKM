'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'
import { FaArrowLeft } from 'react-icons/fa'

export default function PeringkatUKMPage() {
  const [peringkat, setPeringkat] = useState([])
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) {
      const parsed = JSON.parse(stored)
      if (parsed.role !== 'admin') {
        Swal.fire('Akses Ditolak', 'Anda bukan admin.', 'warning')
        router.push('/login')
        return
      }
      setUser(parsed)
      fetchPeringkat()
    } else {
      Swal.fire('Akses Ditolak', 'Silakan login terlebih dahulu.', 'warning')
      router.push('/login')
    }
  }, [])

  const fetchPeringkat = async () => {
    try {
      const res = await fetch('/api/peringkat')
      const data = await res.json()
      if (res.ok) {
        setPeringkat(data)
      } else {
        Swal.fire('Gagal', data.message || 'Gagal memuat data peringkat.', 'error')
      }
    } catch (err) {
      console.error(err)
      Swal.fire('Gagal', 'Terjadi kesalahan.', 'error')
    }
  }

  return (
    <main className="min-h-screen bg-sky-50 p-6">
      <div className="max-w-5xl mx-auto bg-white p-8 rounded-xl shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.push('/dashboard/admin')}
            className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg"
          >
            <FaArrowLeft /> Kembali ke Dashboard
          </button>
          <h1 className="text-2xl font-bold text-sky-700">📈 Peringkat UKM</h1>
        </div>

        {peringkat.length === 0 ? (
          <p className="text-center text-gray-500">Belum ada data peringkat.</p>
        ) : (
          <table className="w-full text-sm border">
            <thead className="bg-sky-100">
              <tr>
                <th className="p-2 border">#</th>
                <th className="p-2 border text-left">UKM</th>
                <th className="p-2 border text-center">Jumlah Kegiatan</th>
                <th className="p-2 border text-center">👍 Setuju</th>
                <th className="p-2 border text-center">👎 Tidak</th>
              </tr>
            </thead>
            <tbody>
              {peringkat.map((ukm, i) => (
                <tr key={ukm._id} className="text-center hover:bg-sky-50">
                  <td className="p-2 border">{i + 1}</td>
                  <td className="p-2 border text-left font-semibold text-sky-800">{ukm.name}</td>
                  <td className="p-2 border">{ukm.totalKegiatan}</td>
                  <td className="p-2 border text-green-600">{ukm.totalSetuju}</td>
                  <td className="p-2 border text-red-600">{ukm.totalTidak}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  )
}
