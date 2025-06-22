'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'
import Link from 'next/link'

export default function MahasiswaDashboard() {
  const [user, setUser] = useState(null)
  const [riwayat, setRiwayat] = useState([])
  const router = useRouter()

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) {
      const parsed = JSON.parse(stored)
      setUser(parsed)
      fetchRiwayat(parsed.id || parsed._id)
    } else {
      Swal.fire('Akses Ditolak', 'Silakan login terlebih dahulu.', 'warning')
      router.push('/login')
    }
  }, [])

  const fetchRiwayat = async (userId) => {
    try {
      const res = await fetch(`/api/anggota?userId=${userId}`)
      const data = await res.json()
      if (res.ok) setRiwayat(data)
    } catch (error) {
      console.error('Gagal memuat riwayat UKM:', error)
    }
  }

  const handleBatalkan = async (id) => {
    const confirm = await Swal.fire({
      title: 'Yakin batal?',
      text: 'Pendaftaran Anda akan dibatalkan.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, batalkan',
    })

    if (!confirm.isConfirmed) return

    try {
      const res = await fetch(`/api/anggota/${id}`, {
        method: 'DELETE',
      })

      const result = await res.json()

      if (res.ok) {
        Swal.fire('Berhasil', result.message || 'Pendaftaran dibatalkan.', 'success')
        fetchRiwayat(user.id || user._id) // refresh list
      } else {
        Swal.fire('Gagal', result.message || 'Terjadi kesalahan.', 'error')
      }
    } catch (err) {
      console.error(err)
      Swal.fire('Gagal', 'Gagal membatalkan pendaftaran.', 'error')
    }
  }

  if (!user) return null

  return (
    <main className="min-h-screen bg-sky-50 p-6 flex flex-col items-center">
      <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-4xl">
        <h1 className="text-2xl font-bold text-sky-700 mb-2">
          Selamat Datang, {user.name} 🎓
        </h1>
        <p className="text-gray-600 mb-6">
          Anda login sebagai <span className="font-semibold">{user.role}</span>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* Navigasi */}
          <Link href="/dashboard/mahasiswa/daftar-ukm">
            <div className="bg-sky-100 hover:bg-sky-200 p-6 rounded-lg shadow cursor-pointer">
              <h2 className="text-lg font-semibold text-sky-800 mb-2">Daftar UKM</h2>
              <p className="text-sm text-gray-600">Lihat dan daftar ke Unit Kegiatan Mahasiswa yang tersedia.</p>
            </div>
          </Link>

          <Link href="/dashboard/mahasiswa/voting">
            <div className="bg-green-100 hover:bg-green-200 p-6 rounded-lg shadow cursor-pointer">
              <h2 className="text-lg font-semibold text-green-800 mb-2">Voting Kegiatan</h2>
              <p className="text-sm text-gray-600">Pilih kegiatan UKM yang ingin Anda dukung atau ikuti.</p>
            </div>
          </Link>

          <Link href="/dashboard/mahasiswa/kegiatan">
            <div className="bg-yellow-100 hover:bg-yellow-200 p-6 rounded-lg shadow cursor-pointer">
              <h2 className="text-lg font-semibold text-yellow-800 mb-2">Lihat Kegiatan</h2>
              <p className="text-sm text-gray-600">Telusuri daftar kegiatan yang sedang atau akan berlangsung.</p>
            </div>
          </Link>

          <Link href="/dashboard/mahasiswa/dokumentasi">
            <div className="bg-purple-100 hover:bg-purple-200 p-6 rounded-lg shadow cursor-pointer">
              <h2 className="text-lg font-semibold text-purple-800 mb-2">Dokumentasi</h2>
              <p className="text-sm text-gray-600">Lihat dokumentasi foto & video kegiatan UKM yang telah berlangsung.</p>
            </div>
          </Link>
        </div>

        {/* Riwayat Pendaftaran */}
        <div className="bg-gray-50 p-5 rounded-lg shadow-inner">
          <h2 className="text-xl font-semibold text-sky-700 mb-3">Riwayat Pendaftaran UKM Anda</h2>
          {riwayat.length > 0 ? (
            <ul className="space-y-3">
              {riwayat.map((item) => (
                <li
                  key={item._id}
                  className="flex justify-between items-center p-4 bg-white border rounded shadow-sm"
                >
                  <div>
                    <p className="font-medium">{item.ukm?.name || 'UKM Tidak Diketahui'}</p>
                    <p className="text-sm text-gray-500">Status: <span className="font-semibold">{item.status}</span></p>
                  </div>
                  {item.status === 'pending' && (
                    <button
                      className="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                      onClick={() => handleBatalkan(item._id)}
                    >
                      Batalkan
                    </button>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-600">Belum ada riwayat pendaftaran UKM.</p>
          )}
        </div>

        <div className="mt-8 text-center">
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
