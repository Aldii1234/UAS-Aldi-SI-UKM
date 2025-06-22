'use client'

import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import { useRouter } from 'next/navigation'

export default function DaftarUKMPage() {
  const [ukmList, setUkmList] = useState([])
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      const stored = localStorage.getItem('user')
      if (stored) {
        const parsed = JSON.parse(stored)
        setUser(parsed)
      } else {
        Swal.fire('Akses Ditolak', 'Silakan login terlebih dahulu.', 'warning')
        router.push('/login')
        return
      }

      const res = await fetch('/api/ukm')
      const data = await res.json()
      setUkmList(data)
    }

    fetchData()
  }, [])

  const handleGabung = async (ukmId, ukmName) => {
    if (!user || !user._id) {
      return Swal.fire('Gagal', 'Silakan login ulang. ID tidak ditemukan.', 'error')
    }

    const { value: formValues } = await Swal.fire({
      title: `Formulir Gabung ${ukmName}`,
      html: `
        <input id="nama" class="swal2-input" placeholder="Nama Lengkap">
        <input id="nim" class="swal2-input" placeholder="NIM">
        <input id="jurusan" class="swal2-input" placeholder="Jurusan">
        <input id="alasan" class="swal2-input" placeholder="Mengapa ingin bergabung?">
        <input id="pengalaman" class="swal2-input" placeholder="Pengalaman terkait UKM ini">
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Kirim',
      preConfirm: () => {
        const nama = document.getElementById('nama').value
        const nim = document.getElementById('nim').value
        const jurusan = document.getElementById('jurusan').value
        const alasan = document.getElementById('alasan').value
        const pengalaman = document.getElementById('pengalaman').value

        if (!nama || !nim || !jurusan || !alasan || !pengalaman) {
          Swal.showValidationMessage('Semua isian wajib diisi.')
          return
        }

        return { nama, nim, jurusan, alasan, pengalaman }
      }
    })

    if (!formValues) return

    const res = await fetch('/api/ukm/gabung', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ukmId,
        userId: user._id,
        ...formValues
      }),
    })

    const result = await res.json()
    if (res.ok) {
      Swal.fire('Berhasil', 'Pendaftaran berhasil dikirim. Silakan tunggu persetujuan pengurus.', 'success')
    } else {
      Swal.fire('Gagal', result.message || 'Terjadi kesalahan.', 'error')
    }
  }

  if (!user) return null

  return (
    <main className="p-4 md:p-6 bg-gradient-to-tr from-sky-100 to-blue-50 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white p-6 md:p-8 rounded-2xl shadow-lg">
        <h1 className="text-2xl md:text-3xl font-bold text-sky-700 mb-6 text-center">
          🎓 Daftar UKM Masoem University
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ukmList.map((ukm) => (
            <div
              key={ukm._id}
              className="bg-white border rounded-xl p-5 shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <h2 className="text-lg font-semibold text-sky-800">{ukm.name}</h2>
                <p className="text-sm text-gray-600">{ukm.description}</p>

                {ukm.profile && (
                  <p className="text-xs text-gray-700 mt-2">
                    <strong>Profil:</strong> {ukm.profile}
                  </p>
                )}

                {ukm.visi && (
                  <p className="text-xs text-gray-700 mt-2">
                    <strong>Visi:</strong> {ukm.visi}
                  </p>
                )}

                {ukm.misi && (
                  <div className="text-xs text-gray-700 mt-2">
                    <strong>Misi:</strong>
                    <ul className="list-disc ml-4 mt-1">
                      {ukm.misi.split('\n').map((misiItem, idx) => (
                        <li key={idx}>{misiItem.replace(/^\d+\.\s*/, '')}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <button
                className="mt-4 bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 text-sm transition"
                onClick={() => handleGabung(ukm._id, ukm.name)}
              >
                ✋ Gabung UKM
              </button>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <button
            onClick={() => router.push('/dashboard/mahasiswa')}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-5 py-2 rounded-lg transition"
          >
            ← Kembali ke Dashboard
          </button>
        </div>
      </div>
    </main>
  )
}
