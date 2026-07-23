import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth'
import { updateUser } from '@/lib/api'

export default function ProfilePage() {

  const { user, setUser } = useAuth()

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    password: '',
  })

  useEffect(() => {
    if (user) {
      setForm({
        firstName: user.firstName ?? '',
        lastName: user.lastName ?? '',
        password: '',
      })
    }
  }, [user])


  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')


  function handleChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }


  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!user?.id)
        return

    try {

      setSaving(true)
      setError('')
      setSuccess('')


      const updatedUser = await updateUser(user.id, {
        firstName: form.firstName,
        lastName: form.lastName,
        password: form.password || undefined,
      })

      console.log(user)

      // Mettre à jour le contexte avec les nouvelles infos
      setUser(updatedUser)


      setSuccess('Profile updated successfully.')


      setForm(prev => ({
        ...prev,
        password: '',
      }))


    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : 'Update failed'
      )

    } finally {
      setSaving(false)
    }
  }


  return (
    <div className="max-w-2xl mx-auto p-8">

      <h1 className="text-2xl font-bold text-slate-200 mb-6">
        My Profile
      </h1>


      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >

        <div>
          <label className="block text-slate-300 mb-1">
            First name
          </label>

          <input
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded bg-slate-800 text-white"
          />
        </div>


        <div>
          <label className="block text-slate-300 mb-1">
            Last name
          </label>

          <input
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded bg-slate-800 text-white"
          />
        </div>


        <div>
          <label className="block text-slate-300 mb-1">
            New password
          </label>

          <input
            name="password"
            type="password"
            placeholder="Leave empty to keep current password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded bg-slate-800 text-white"
          />
        </div>


        {success && (
          <p className="text-green-400">
            {success}
          </p>
        )}


        {error && (
          <p className="text-red-400">
            {error}
          </p>
        )}


        <button
          disabled={saving}
          className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save changes'}
        </button>

      </form>

    </div>
  )
}