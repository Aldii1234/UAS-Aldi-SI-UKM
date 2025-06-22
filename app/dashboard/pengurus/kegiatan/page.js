'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'
import {
  FaPlusCircle,
  FaTrash,
  FaEdit,
  FaArrowLeft
} from 'react-icons/fa'

export default function KegiatanPengurusPage() {
  const [user, setUser] = useState(null)
  const [kegiatanList, setKegiatanList] = useState([])
  const [ukmList, setUkmList] = useState([])
  const router = useRouter()

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) {
      const parsed = JSON.parse(stored)
      if (parsed.role === 'pengurus') {
        setUser(parsed)
        fetchKegiatan()
        fetchUKM()
      } else {
        Swal.fire('Akses Ditolak', 'Anda bukan pengurus.', 'warning')
        router.push('/login')
      }
    } else {
      Swal.fire('Akses Ditolak', 'Silakan login terlebih dahulu.', 'warning')
      router.push('/login')
    }
  }, [])

  const fetchKegiatan = async () => {
    try {
      const res = await fetch('/api/kegiatan')
      const data = await res.json()
      if (res.ok && Array.isArray(data)) {
        setKegiatanList(data)
      }
    } catch (err) {
      Swal.fire('Gagal', 'Gagal memuat data kegiatan.', 'error')
    }
  }

  const fetchUKM = async () => {
    try {
      const res = await fetch('/api/ukm')
      const data = await res.json()
      setUkmList(data)
    } catch (err) {
      console.error('Gagal memuat UKM', err)
    }
  }

  const handleTambah = async () => {
    let judul = '', deskripsi = '', tanggal = '', ukmId = ''
    const { value: confirm } = await Swal.fire({
      title: 'Tambah Kegiatan',
      html: `
        <input id="swal-input-judul" class="swal2-input" placeholder="Judul Kegiatan">
        <textarea id="swal-input-deskripsi" class="swal2-textarea" placeholder="Deskripsi Kegiatan"></textarea>
        <input id="swal-input-tanggal" type="date" class="swal2-input">
        <select id="swal-input-ukm" class="swal2-select">
          <option value="">-- Pilih UKM --</option>
          ${ukmList.map((ukm) => `<option value="${ukm._id}">${ukm.name}</option>`).join('')}
        </select>
      `,
      focusConfirm: false,
      showCancelButton: true,
      preConfirm: () => {
        judul = document.getElementById('swal-input-judul').value.trim()
        deskripsi = document.getElementById('swal-input-deskripsi').value.trim()
        tanggal = document.getElementById('swal-input-tanggal').value
        ukmId = document.getElementById('swal-input-ukm').value
        if (!judul || !deskripsi || !tanggal || !ukmId) {
          Swal.showValidationMessage('Semua isian wajib diisi!')
          return false
        }
        return true
      }
    })

    if (!confirm) return

    const res = await fetch('/api/kegiatan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ judul, deskripsi, tanggal, ukmId, pengurus: user._id, status: 'pending' })
    })

    if (res.ok) {
      Swal.fire('Berhasil', 'Kegiatan ditambahkan.', 'success')
      fetchKegiatan()
    } else {
      const err = await res.json()
      Swal.fire('Gagal', err.message || 'Gagal menambahkan kegiatan.', 'error')
    }
  }

  const handleEdit = async (kegiatan) => {
    const { value: confirm } = await Swal.fire({
      title: 'Edit Kegiatan',
      html: `
        <input id="swal-edit-judul" class="swal2-input" placeholder="Judul" value="${kegiatan.judul}">
        <textarea id="swal-edit-deskripsi" class="swal2-textarea" placeholder="Deskripsi">${kegiatan.deskripsi}</textarea>
        <input id="swal-edit-tanggal" type="date" class="swal2-input" value="${kegiatan.tanggal?.split('T')[0]}">
        <select id="swal-edit-ukm" class="swal2-select">
          ${ukmList.map((ukm) =>
            `<option value="${ukm._id}" ${ukm._id === kegiatan.ukmId?._id ? 'selected' : ''}>${ukm.name}</option>`
          ).join('')}
        </select>
      `,
      focusConfirm: false,
      showCancelButton: true,
      preConfirm: () => {
        const judul = document.getElementById('swal-edit-judul').value.trim()
        const deskripsi = document.getElementById('swal-edit-deskripsi').value.trim()
        const tanggal = document.getElementById('swal-edit-tanggal').value
        const ukmId = document.getElementById('swal-edit-ukm').value
        if (!judul || !deskripsi || !tanggal || !ukmId) {
          Swal.showValidationMessage('Semua isian wajib diisi!')
          return false
        }
        return { judul, deskripsi, tanggal, ukmId }
      }
    })

    if (!confirm) return

    const res = await fetch(`/api/kegiatan/${kegiatan._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(confirm)
    })

    if (res.ok) {
      Swal.fire('Berhasil', 'Kegiatan berhasil diperbarui.', 'success')
      fetchKegiatan()
    } else {
      Swal.fire('Gagal', 'Gagal memperbarui kegiatan.', 'error')
    }
  }

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: 'Hapus Kegiatan?',
      text: 'Tindakan ini tidak bisa dikembalikan!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, hapus'
    })

    if (!confirm.isConfirmed) return

    const res = await fetch(`/api/kegiatan/${id}`, {
      method: 'DELETE'
    })

    if (res.ok) {
      Swal.fire('Berhasil', 'Kegiatan berhasil dihapus.', 'success')
      fetchKegiatan()
    } else {
      Swal.fire('Gagal', 'Gagal menghapus kegiatan.', 'error')
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'disetujui':
        return <span className="bg-green-100 text-green-700 px-2 py-1 text-xs rounded-full">✅ Disetujui</span>
      case 'ditolak':
        return <span className="bg-red-100 text-red-700 px-2 py-1 text-xs rounded-full">❌ Ditolak</span>
      default:
        return <span className="bg-yellow-100 text-yellow-700 px-2 py-1 text-xs rounded-full">⏳ Pending</span>
    }
  }

  if (!user) return null

  return (
    <main className="min-h-screen bg-blue-50 p-6">
      <div className="max-w-6xl mx-auto bg-white p-8 rounded-2xl shadow-xl">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => router.push('/dashboard/pengurus')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
          >
            <FaArrowLeft /> Kembali
          </button>
          <button
            onClick={handleTambah}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <FaPlusCircle /> Tambah Kegiatan
          </button>
        </div>

        {kegiatanList.length === 0 ? (
          <p className="text-center text-gray-500">Belum ada kegiatan.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {kegiatanList.map((kegiatan) => (
              <div
                key={kegiatan._id}
                className="bg-white border rounded-xl p-5 shadow hover:shadow-lg transition"
              >
                <h2 className="text-lg font-bold text-blue-700">{kegiatan.judul}</h2>
                <p className="text-sm text-gray-700 mb-2">{kegiatan.deskripsi}</p>
                <p className="text-xs text-gray-500">Tanggal: {new Date(kegiatan.tanggal).toLocaleDateString()}</p>
                <p className="text-xs italic text-gray-400">UKM: {kegiatan.ukmId?.name || 'Tidak tersedia'}</p>
                <div className="mt-2">{getStatusBadge(kegiatan.status)}</div>
                <div className="mt-4 flex gap-4">
                  <button
                    onClick={() => handleEdit(kegiatan)}
                    title="Edit"
                    className="text-yellow-500 hover:text-yellow-600"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(kegiatan._id)}
                    title="Hapus"
                    className="text-red-500 hover:text-red-600"
                  >
                    <FaTrash />
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
