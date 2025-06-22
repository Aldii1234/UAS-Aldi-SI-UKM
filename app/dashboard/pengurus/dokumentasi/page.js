'use client'

import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import { useRouter } from 'next/navigation'
import { FaArrowLeft, FaTrash, FaEdit } from 'react-icons/fa'

export default function DokumentasiPage() {
  const [user, setUser] = useState(null)
  const [list, setList] = useState([])
  const [ukmList, setUkmList] = useState([])
  const [file, setFile] = useState(null)
  const [editing, setEditing] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) {
      const parsed = JSON.parse(stored)
      if (parsed.role === 'pengurus') {
        setUser(parsed)
        fetchDokumentasi()
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

  const fetchDokumentasi = async () => {
    try {
      const res = await fetch('/api/dokumentasi')
      const data = await res.json()
      setList(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Gagal mengambil dokumentasi:', err)
    }
  }

  const fetchUKM = async () => {
    try {
      const res = await fetch('/api/ukm')
      const data = await res.json()
      setUkmList(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Gagal mengambil UKM:', err)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const form = e.target

    const formData = new FormData()
    formData.append('namaKegiatan', form.namaKegiatan.value)
    formData.append('deskripsi', form.deskripsi.value)
    formData.append('pengurus', user._id)
    formData.append('ukm', form.ukm.value)
    if (file) formData.append('file', file)

    try {
      const url = editing ? `/api/dokumentasi/${editing._id}` : '/api/dokumentasi'
      const method = editing ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        body: formData
      })

      const result = await res.json()
      if (res.ok) {
        Swal.fire('Berhasil', result.message, 'success')
        setFile(null)
        setEditing(null)
        form.reset()
        fetchDokumentasi()
      } else {
        Swal.fire('Gagal', result.message, 'error')
      }
    } catch (err) {
      console.error('Submit error:', err)
      Swal.fire('Error', 'Terjadi kesalahan saat mengirim data.', 'error')
    }
  }

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: 'Hapus Dokumentasi?',
      text: 'Data yang dihapus tidak bisa dikembalikan.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Hapus',
      cancelButtonText: 'Batal'
    })

    if (!confirm.isConfirmed) return

    try {
      const res = await fetch(`/api/dokumentasi/${id}`, { method: 'DELETE' })
      const result = await res.json()
      if (res.ok) {
        Swal.fire('Dihapus', result.message, 'success')
        fetchDokumentasi()
      } else {
        Swal.fire('Gagal', result.message, 'error')
      }
    } catch (err) {
      console.error('Delete error:', err)
    }
  }

  const handleEdit = (doc) => {
    setEditing(doc)
    document.querySelector('[name="namaKegiatan"]').value = doc.namaKegiatan
    document.querySelector('[name="deskripsi"]').value = doc.deskripsi
    document.querySelector('[name="ukm"]').value = doc.ukm?._id || ''
    setFile(null)
  }

  return (
    <main className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-xl shadow-md">
        {/* Tombol Kembali */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/dashboard/pengurus')}
            className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
          >
            <FaArrowLeft /> Kembali ke Dashboard
          </button>
        </div>

        <h1 className="text-2xl font-bold text-blue-700 mb-4">
          {editing ? '✏️ Edit Dokumentasi' : '📸 Upload Dokumentasi Baru'}
        </h1>

        {/* Form Upload/Edit */}
        <form onSubmit={handleSubmit} className="space-y-4 mb-8">
          <input name="namaKegiatan" placeholder="Nama Kegiatan" className="w-full border p-2 rounded" required />
          <textarea name="deskripsi" placeholder="Deskripsi" className="w-full border p-2 rounded" required />
          <select name="ukm" className="w-full border p-2 rounded" required>
            <option value="">-- Pilih UKM --</option>
            {ukmList.map(ukm => (
              <option key={ukm._id} value={ukm._id}>{ukm.name}</option>
            ))}
          </select>
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            {editing ? 'Simpan Perubahan' : 'Upload'}
          </button>
        </form>

        {/* Daftar Dokumentasi */}
        <h2 className="text-lg font-semibold mb-3">📁 Daftar Dokumentasi</h2>
        {list.length === 0 ? (
          <p className="text-gray-500">Belum ada dokumentasi.</p>
        ) : (
          <ul className="space-y-4">
            {list.map((doc) => (
              <li key={doc._id} className="border p-4 rounded shadow-sm bg-gray-50">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold text-blue-800">{doc.namaKegiatan}</p>
                    <p className="text-sm text-gray-600">{doc.deskripsi}</p>
                    <p className="text-xs text-gray-500">
                      Oleh: {doc.pengurus?.name} | UKM: {doc.ukm?.name}
                    </p>
                    {doc.filePath && (
                      <a
                        href={doc.filePath}
                        className="text-blue-500 text-sm underline"
                        target="_blank"
                        rel="noreferrer"
                      >
                        📄 Lihat File
                      </a>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(doc)}
                      className="text-yellow-600 hover:text-yellow-800"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(doc._id)}
                      className="text-red-600 hover:text-red-800"
                      title="Hapus"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  )
}
