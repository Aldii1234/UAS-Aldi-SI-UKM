'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Swal from 'sweetalert2'
import { useRouter } from 'next/navigation'
import { FaPlus, FaEdit, FaUsers, FaTrash, FaArrowLeft } from 'react-icons/fa'

export default function AdminUKMPage() {
  const [ukmList, setUkmList] = useState([])
  const router = useRouter()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const res = await fetch('/api/ukm')
      const data = await res.json()
      setUkmList(data)
    } catch (err) {
      console.error(err)
      Swal.fire('Gagal', 'Tidak dapat memuat data UKM.', 'error')
    }
  }

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: 'Hapus UKM?',
      text: 'Data yang dihapus tidak dapat dikembalikan.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, hapus',
      cancelButtonText: 'Batal',
    })

    if (confirm.isConfirmed) {
      try {
        const res = await fetch(`/api/ukm/${id}`, {
          method: 'DELETE',
        })
        const data = await res.json()

        if (res.ok) {
          Swal.fire('Berhasil', data.message, 'success')
          fetchData() // refresh list
        } else {
          throw new Error(data.message)
        }
      } catch (err) {
        Swal.fire('Gagal', err.message || 'Gagal menghapus UKM', 'error')
      }
    }
  }

  return (
    <main className="min-h-screen bg-sky-50 p-6">
      <div className="max-w-6xl mx-auto bg-white p-8 rounded-xl shadow">

        {/* Tombol Kembali */}
        <div className="mb-4">
          <Link href="/dashboard/admin">
            <button className="flex items-center gap-2 text-sm text-sky-600 hover:text-sky-800 transition">
              <FaArrowLeft /> Kembali ke Dashboard
            </button>
          </Link>
        </div>

        {/* Header dan tombol tambah */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-sky-700">Manajemen UKM</h1>
          <Link href="/dashboard/admin/ukm/tambah">
            <button className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 shadow">
              <FaPlus /> Tambah UKM
            </button>
          </Link>
        </div>

        {ukmList.length === 0 ? (
          <p className="text-gray-500">Belum ada UKM yang terdaftar.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ukmList.map((ukm) => (
              <div
                key={ukm._id}
                className="p-6 bg-blue-50 rounded-lg shadow hover:shadow-md transition duration-200"
              >
                <h2 className="text-lg font-semibold text-sky-800">{ukm.name}</h2>
                <p className="text-sm text-gray-600 mt-2 mb-4">{ukm.description}</p>
                <div className="flex flex-wrap gap-2">
                  {/* Tombol Edit */}
                  <Link href={`/dashboard/admin/ukm/edit/${ukm._id}`}>
                    <button className="flex items-center gap-1 text-sm bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded shadow">
                      <FaEdit /> Edit
                    </button>
                  </Link>

                  {/* Tombol Anggota */}
                  <Link href={`/dashboard/admin/ukm/${ukm._id}/anggota`}>
                    <button className="flex items-center gap-1 text-sm bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1 rounded shadow">
                      <FaUsers /> Anggota
                    </button>
                  </Link>

                  {/* Tombol Hapus */}
                  <button
                    onClick={() => handleDelete(ukm._id)}
                    className="flex items-center gap-1 text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded shadow"
                  >
                    <FaTrash /> Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
