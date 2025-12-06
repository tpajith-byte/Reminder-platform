'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { User } from '@supabase/supabase-js'
import { Bell, Plus, Calendar, Trash2, LogOut, FileText } from 'lucide-react'

interface Reminder {
    id: string
    reminder_type: string
    document_name: string
    document_description?: string
    expiry_date: string
    reminder_date: string
    created_at: string
}

export default function DashboardClient({ user }: { user: User }) {
    const [reminders, setReminders] = useState<Reminder[]>([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [formData, setFormData] = useState({
        reminder_type: '',
        other_reminder_type: '',
        document_name: '',
        document_description: '',
        expiry_date: '',
        reminder_date: '',
    })

    const reminderTypes = [
        'Vehicle insurance',
        'Vehicle Pollution',
        'Vehicle Registration',
        'Vehicle service',
        'Passport',
        'Vaccination',
        'Land Tax',
        'Property Tax',
        'Others'
    ]

    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        fetchReminders()
    }, [])

    const fetchReminders = async () => {
        try {
            const { data, error } = await supabase
                .from('reminders')
                .select('*')
                .order('reminder_date', { ascending: true })

            if (error) throw error
            setReminders(data || [])
        } catch (err) {
            console.error('Error fetching reminders:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            const { error } = await supabase.from('reminders').insert([
                {
                    ...formData,
                    user_id: user.id,
                },
            ])

            if (error) throw error

            setFormData({ reminder_type: '', other_reminder_type: '', document_name: '', document_description: '', expiry_date: '', reminder_date: '' })
            setShowForm(false)
            fetchReminders()
        } catch (err) {
            console.error('Error creating reminder:', err)
            alert('Failed to create reminder')
        }
    }

    const handleDelete = async (id: string) => {
        try {
            const { error } = await supabase.from('reminders').delete().eq('id', id)

            if (error) throw error
            fetchReminders()
        } catch (err) {
            console.error('Error deleting reminder:', err)
        }
    }

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/login')
        router.refresh()
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            {/* Header */}
            <header className="bg-white/10 backdrop-blur-lg border-b border-white/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Bell className="w-8 h-8 text-purple-400" />
                            <h1 className="text-2xl font-bold text-white">Reminder Platform</h1>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-gray-300">{user.email}</span>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-200 rounded-lg transition"
                            >
                                <LogOut className="w-4 h-4" />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-3xl font-bold text-white">Your Reminders</h2>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition shadow-lg"
                    >
                        <Plus className="w-5 h-5" />
                        New Reminder
                    </button>
                </div>

                {/* Create Form */}
                {showForm && (
                    <div className="mb-8 p-6 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20">
                        <h3 className="text-xl font-semibold text-white mb-4">Create New Reminder</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-200 mb-2">Reminder Type</label>
                                <select
                                    value={formData.reminder_type}
                                    onChange={(e) => setFormData({ ...formData, reminder_type: e.target.value })}
                                    required
                                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                >
                                    <option value="" disabled>Select a type...</option>
                                    {reminderTypes.map(type => (
                                        <option key={type} value={type} className="bg-slate-800">{type}</option>
                                    ))}
                                </select>
                            </div>
                            {formData.reminder_type === 'Others' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-200 mb-2">Other Reminder Type</label>
                                    <input
                                        type="text"
                                        value={formData.other_reminder_type}
                                        onChange={(e) => setFormData({ ...formData, other_reminder_type: e.target.value })}
                                        required
                                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        placeholder="Enter reminder type..."
                                    />
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-medium text-gray-200 mb-2">Document Name</label>
                                <input
                                    type="text"
                                    value={formData.document_name}
                                    onChange={(e) => setFormData({ ...formData, document_name: e.target.value })}
                                    required
                                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="e.g., Car Insurance - Honda Accord"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-200 mb-2">Document Description</label>
                                <textarea
                                    value={formData.document_description}
                                    onChange={(e) => setFormData({ ...formData, document_description: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="Additional details..."
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-200 mb-2">Expiry Date</label>
                                    <input
                                        type="date"
                                        value={formData.expiry_date}
                                        onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                                        required
                                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-200 mb-2">Reminder Date</label>
                                    <input
                                        type="date"
                                        value={formData.reminder_date}
                                        onChange={(e) => setFormData({ ...formData, reminder_date: e.target.value })}
                                        required
                                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition"
                                >
                                    Create Reminder
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="px-6 py-3 bg-white/5 text-white rounded-lg hover:bg-white/10 transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Reminders List */}
                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
                        <p className="text-gray-300 mt-4">Loading reminders...</p>
                    </div>
                ) : reminders.length === 0 ? (
                    <div className="text-center py-12 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/20">
                        <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-white mb-2">No reminders yet</h3>
                        <p className="text-gray-300">Create your first reminder to get started!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {reminders.map((reminder) => (
                            <div
                                key={reminder.id}
                                className="p-6 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 hover:bg-white/15 transition group"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <FileText className="w-5 h-5 text-purple-400" />
                                        <span className="text-xs font-semibold text-purple-300 uppercase">
                                            {reminder.reminder_type === 'Others' ? (reminder as any).other_reminder_type : reminder.reminder_type}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(reminder.id)}
                                        className="opacity-0 group-hover:opacity-100 transition p-2 hover:bg-red-500/20 rounded-lg"
                                    >
                                        <Trash2 className="w-4 h-4 text-red-400" />
                                    </button>
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-2">{reminder.document_name}</h3>
                                {reminder.document_description && (
                                    <p className="text-gray-300 mb-4 text-sm">{reminder.document_description}</p>
                                )}
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-gray-400">
                                        <Calendar className="w-4 h-4" />
                                        <span>Expires: {new Date(reminder.expiry_date).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-yellow-300">
                                        <Bell className="w-4 h-4" />
                                        <span>Remind: {new Date(reminder.reminder_date).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    )
}
