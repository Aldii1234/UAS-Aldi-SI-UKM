'use client'
import { useState } from 'react'
import Swal from 'sweetalert2'

export default function UploadDokumentasiModal({ onUpload }) {
  const [judul, setJudul] = useState('')
  const [deskripsi, setDeskripsi] = useState('')
  const [file, setFile] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!judul || !deskripsi || !file) {
      return Swal.fire('Gagal', 'Semua field wajib diisi', 'warning')
    }

    const formData = new FormData()
    formData.append('judul', judul)
    formData.append('deskripsi', deskripsi)
    formData.append('file', file)

    const res = await fetch('/api/dokumentasi/upload', {
      method: 'POST',
      body: formData,
    })

    const result = await res.json()
    if (res.ok) {
      Swal.fire('Berhasil', result.message, 'success')
      onUpload()
    } else {
      Swal.fire('Gagal', result.message, 'error')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Judul"
        className="w-full border rounded p-2"
        value={judul}
        onChange={(e) => setJudul(e.target.value)}
      />
      <textarea
        placeholder="Deskripsi"
        className="w-full border rounded p-2"
        value={deskripsi}
        onChange={(e) => setDeskripsi(e.target.value)}
      />
      <input
        type="file"
        accept="image/*,video/*,application/pdf"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        Upload Dokumentasi
      </button>
    </form>
  )
}
