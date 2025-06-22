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
      const res = await fetch(`/api/anggota/${id}`, { method: 'DELETE' })
      const result = await res.json()

      if (res.ok) {
        Swal.fire('Berhasil', result.message || 'Pendaftaran dibatalkan.', 'success')
        fetchRiwayat(user.id || user._id)
      } else {
        Swal.fire('Gagal', result.message || 'Terjadi kesalahan.', 'error')
      }
    } catch (err) {
      console.error(err)
      Swal.fire('Gagal', 'Gagal membatalkan pendaftaran.', 'error')
    }
  }

  if (!user) return null

  const statusBadge = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      disetujui: 'bg-green-100 text-green-800',
      ditolak: 'bg-red-100 text-red-800'
    }
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-purple-50 p-6 flex flex-col items-center">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-5xl">
        <h1 className="text-3xl font-bold text-sky-800 mb-2">
          Selamat Datang, {user.name} 👋
        </h1>
        <p className="text-gray-600 mb-8">
          Anda login sebagai <span className="font-semibold text-blue-600">{user.role}</span>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* Navigasi */}
          <Card link="/dashboard/mahasiswa/daftar-ukm" title="📋 Daftar UKM" color="blue" desc="Lihat dan daftar ke UKM yang tersedia." />
          <Card link="/dashboard/mahasiswa/voting" title="🗳️ Voting Kegiatan" color="green" desc="Dukung kegiatan UKM pilihan Anda." />
          <Card link="/dashboard/mahasiswa/kegiatan" title="📆 Lihat Kegiatan" color="yellow" desc="Lihat kegiatan yang sedang berjalan." />
          <Card link="/dashboard/mahasiswa/dokumentasi" title="📸 Dokumentasi" color="purple" desc="Lihat dokumentasi kegiatan UKM." />
        </div>

        <div className="bg-sky-50 p-6 rounded-xl shadow-inner">
          <h2 className="text-xl font-bold text-sky-700 mb-4">Riwayat Pendaftaran UKM Anda 🗂️</h2>
          {riwayat.length > 0 ? (
            <ul className="space-y-3">
              {riwayat.map((item) => (
                <li
                  key={item._id}
                  className="flex justify-between items-center p-4 bg-white border rounded-xl shadow"
                >
                  <div>
                    <p className="font-semibold text-sky-800">{item.ukm?.name || 'UKM Tidak Diketahui'}</p>
                    <p className="text-sm text-gray-500 mt-1">Status: {statusBadge(item.status)}</p>
                  </div>
                  {item.status === 'pending' && (
                    <button
                      className="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded shadow"
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

        <div className="mt-10 text-center">
          <button
            onClick={() => {
              localStorage.removeItem('user')
              router.push('/login')
            }}
            className="bg-red-500 text-white px-6 py-2 rounded-lg shadow hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    </main>
  )
}

function Card({ link, title, desc, color }) {
  const bg = {
    blue: 'from-sky-100 to-sky-200',
    green: 'from-green-100 to-green-200',
    yellow: 'from-yellow-100 to-yellow-200',
    purple: 'from-purple-100 to-purple-200'
  }[color]

  return (
    <Link href={link}>
      <div className={`bg-gradient-to-br ${bg} p-6 rounded-xl shadow-lg transition hover:scale-[1.02] cursor-pointer`}>
        <h2 className="text-lg font-bold text-gray-800 mb-2">{title}</h2>
        <p className="text-sm text-gray-600">{desc}</p>
      </div>
    </Link>
  )
}
