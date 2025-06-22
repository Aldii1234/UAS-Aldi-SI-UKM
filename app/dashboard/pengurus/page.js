'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { FaCalendarPlus, FaImages, FaPoll, FaSignOutAlt, FaUserCheck, FaTimesCircle } from 'react-icons/fa'

export default function PengurusDashboard() {
  const [user, setUser] = useState(null)
  const [pendaftar, setPendaftar] = useState([])
  const router = useRouter()

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) {
      const parsed = JSON.parse(stored)
      if (parsed.role === 'pengurus') {
        setUser(parsed)
        fetchPendaftar()
      } else {
        Swal.fire('Akses Ditolak', 'Anda bukan pengurus.', 'warning')
        router.push('/login')
      }
    } else {
      Swal.fire('Akses Ditolak', 'Silakan login terlebih dahulu.', 'warning')
      router.push('/login')
    }
  }, [])

  const fetchPendaftar = async () => {
    const res = await fetch('/api/anggota?status=pending')
    const data = await res.json()
    if (res.ok) setPendaftar(data)
  }

  const handleStatus = async (id, status) => {
    const confirm = await Swal.fire({
      title: status === 'disetujui' ? 'Setujui pendaftaran?' : 'Tolak pendaftaran?',
      icon: status === 'disetujui' ? 'question' : 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya',
    })

    if (!confirm.isConfirmed) return

    const res = await fetch(`/api/anggota/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })

    const result = await res.json()
    if (res.ok) {
      Swal.fire('Berhasil', result.message, 'success')
      fetchPendaftar()
    } else {
      Swal.fire('Gagal', result.message || 'Terjadi kesalahan.', 'error')
    }
  }

  if (!user) return null

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-100 via-sky-100 to-indigo-100 p-6 flex justify-center items-start">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-6xl"
      >
        <h1 className="text-3xl font-bold text-blue-700 mb-1 flex items-center gap-2">
          👋 Halo, {user.name}
        </h1>
        <p className="text-gray-600 mb-6">
          Anda login sebagai <span className="font-semibold">{user.role}</span>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Link href="/dashboard/pengurus/kegiatan">
            <motion.div whileHover={{ scale: 1.03 }} className="bg-blue-100 hover:bg-blue-200 transition p-6 rounded-xl shadow-sm cursor-pointer">
              <FaCalendarPlus className="text-blue-800 text-3xl mb-3" />
              <h2 className="text-lg font-bold text-blue-800">Buat / Edit Kegiatan</h2>
              <p className="text-sm text-gray-600 mt-1">Kelola kegiatan UKM yang akan datang atau sedang berjalan.</p>
            </motion.div>
          </Link>

          <Link href="/dashboard/pengurus/dokumentasi">
            <motion.div whileHover={{ scale: 1.03 }} className="bg-purple-100 hover:bg-purple-200 transition p-6 rounded-xl shadow-sm cursor-pointer">
              <FaImages className="text-purple-800 text-3xl mb-3" />
              <h2 className="text-lg font-bold text-purple-800">Upload Dokumentasi</h2>
              <p className="text-sm text-gray-600 mt-1">Unggah foto & video dari kegiatan UKM Anda.</p>
            </motion.div>
          </Link>

          <Link href="/dashboard/pengurus/voting">
            <motion.div whileHover={{ scale: 1.03 }} className="bg-green-100 hover:bg-green-200 transition p-6 rounded-xl shadow-sm cursor-pointer">
              <FaPoll className="text-green-800 text-3xl mb-3" />
              <h2 className="text-lg font-bold text-green-800">Lihat Voting</h2>
              <p className="text-sm text-gray-600 mt-1">Lihat hasil voting mahasiswa terhadap kegiatan Anda.</p>
            </motion.div>
          </Link>
        </div>

        {/* ✅ Pendaftar UKM */}
        <div className="bg-gray-50 p-6 rounded-xl shadow-inner mt-6">
          <h2 className="text-xl font-semibold text-sky-700 mb-4">📋 Daftar Pendaftar UKM (Menunggu Persetujuan)</h2>
          {pendaftar.length === 0 ? (
            <p className="text-gray-500 text-sm">Belum ada pendaftar yang menunggu persetujuan.</p>
          ) : (
            <ul className="space-y-4">
              {pendaftar.map((item) => (
                <li
                  key={item._id}
                  className="bg-white border rounded-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center"
                >
                  <div className="mb-2 md:mb-0">
                    <p className="font-medium text-blue-700">{item.user?.name} ({item.user?.email})</p>
                    <p className="text-sm text-gray-600">UKM: {item.ukm?.name}</p>
                    <p className="text-sm text-gray-600">Alasan: {item.alasan}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStatus(item._id, 'disetujui')}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded flex items-center gap-1 text-sm"
                    >
                      <FaUserCheck /> Setujui
                    </button>
                    <button
                      onClick={() => handleStatus(item._id, 'ditolak')}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded flex items-center gap-1 text-sm"
                    >
                      <FaTimesCircle /> Tolak
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-10 text-center">
          <button
            onClick={() => {
              localStorage.removeItem('user')
              router.push('/login')
            }}
            className="inline-flex items-center gap-2 bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 transition"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </motion.div>
    </main>
  )
}
