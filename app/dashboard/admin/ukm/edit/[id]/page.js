'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Swal from 'sweetalert2'

export default function EditUKMPage() {
  const params = useParams()
  const router = useRouter()
  const { id } = params

  const [form, setForm] = useState({
    name: '',
    description: '',
    profile: '',
    visi: '',
    misi: '',
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/ukm/${id}`)
        if (!res.ok) throw new Error('Gagal mengambil data UKM.')
        const data = await res.json()
        setForm({
          name: data.name || '',
          description: data.description || '',
          profile: data.profile || '',
          visi: data.visi || '',
          misi: data.misi || '',
        })
        setLoading(false)
      } catch (error) {
        Swal.fire('Error', error.message, 'error')
        router.push('/dashboard/admin/ukm')
      }
    }

    if (id) fetchData()
  }, [id, router])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const res = await fetch(`/api/ukm/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (res.ok) {
        Swal.fire('Berhasil', 'Data UKM berhasil diperbarui!', 'success')
        router.push('/dashboard/admin/ukm')
      } else {
        throw new Error(data.message || 'Terjadi kesalahan.')
      }
    } catch (err) {
      Swal.fire('Gagal', err.message, 'error')
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Memuat data UKM...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-sky-50 p-6 flex justify-center items-start">
      <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-xl">
        <h1 className="text-2xl font-bold text-sky-700 mb-6">Edit UKM</h1>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Nama UKM</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full border rounded px-4 py-2"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-medium">Deskripsi</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              rows="3"
              className="w-full border rounded px-4 py-2"
            ></textarea>
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-medium">Profil UKM</label>
            <textarea
              name="profile"
              value={form.profile}
              onChange={handleChange}
              required
              rows="3"
              className="w-full border rounded px-4 py-2"
            ></textarea>
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-medium">Visi</label>
            <textarea
              name="visi"
              value={form.visi}
              onChange={handleChange}
              required
              rows="2"
              className="w-full border rounded px-4 py-2"
            ></textarea>
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-medium">Misi</label>
            <textarea
              name="misi"
              value={form.misi}
              onChange={handleChange}
              required
              rows="3"
              className="w-full border rounded px-4 py-2"
            ></textarea>
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
            >
              Batal
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-sky-600 text-white hover:bg-sky-700 rounded"
            >
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}
