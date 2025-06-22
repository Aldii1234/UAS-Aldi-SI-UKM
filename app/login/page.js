'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const router = useRouter()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    const data = await res.json()

    if (res.ok && data.user) {
      Swal.fire('Berhasil Login!', '', 'success')
      localStorage.setItem('user', JSON.stringify(data.user))

      switch (data.user.role) {
        case 'admin':
          router.push('/dashboard/admin')
          break
        case 'pengurus':
          router.push('/dashboard/pengurus')
          break
        case 'mahasiswa':
        default:
          router.push('/dashboard/mahasiswa')
          break
      }
    } else {
      Swal.fire('Gagal Login', data.message || 'Email atau password salah.', 'error')
    }
  }

  return (
    <main className="flex justify-center items-center min-h-screen bg-sky-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-sky-700 mb-6 text-center">Login UKM Mahasiswa</h1>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full border px-4 py-2 mb-4 rounded-lg"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full border px-4 py-2 mb-6 rounded-lg"
          required
        />
        <button
          type="submit"
          className="w-full bg-sky-600 hover:bg-sky-700 text-white py-2 rounded-lg font-medium"
        >
          Masuk
        </button>
        <p className="text-center text-sm mt-4">
          Belum punya akun?{' '}
          <a href="/register" className="text-sky-600 hover:underline">
            Daftar di sini
          </a>
        </p>

        {/* ✅ Tambahan Catatan Login */}
        <div className="mt-6 bg-sky-50 border border-sky-200 text-sm text-gray-700 p-4 rounded-lg">
          <p className="font-semibold text-sky-700 mb-2">🔐 Akun Demo:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <span className="font-medium">Admin:</span><br />
              Email: <code>admin@gmail.com</code><br />
              Password: <code>admin123</code>
            </li>
            <li>
              <span className="font-medium">Pengurus:</span><br />
              Email: <code>pengurus@gmail.com</code><br />
              Password: <code>pengurus</code>
            </li>
          </ul>
        </div>
      </form>
    </main>
  )
}
