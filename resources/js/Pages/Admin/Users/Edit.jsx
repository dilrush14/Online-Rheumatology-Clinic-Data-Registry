import React from 'react';
import { useForm, usePage } from '@inertiajs/react';
import AppShell from '@/components/app-shell';
import PageHeader from '@/components/page-header'; // ✅ Add this if you have it
import BackButton from '@/components/BackButton'; // ✅ import your new component


export default function Edit() {
    const { roles, user } = usePage().props;

    const { data, setData, put, processing, errors } = useForm({
        name: user.name || '',
        email: user.email || '',
        role: user.role || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('admin.users.update', user.id));
    };

    return (
            <AppShell>
                <PageHeader
                    title="Create New User"
                    actions={<BackButton />}
                />
    
                <div className="p-8 max-w-2xl mx-auto bg-white shadow-md rounded-md">

            <div className="p-8 max-w-2xl mx-auto bg-white shadow-md rounded-md">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={e => setData('name', e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Enter full name"
                        />
                        {errors.name && <div className="text-red-600 text-sm mt-1">{errors.name}</div>}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            value={data.email}
                            onChange={e => setData('email', e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Enter email"
                        />
                        {errors.email && <div className="text-red-600 text-sm mt-1">{errors.email}</div>}
                    </div>

                    {/* Role */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                        <select
                            value={data.role}
                            onChange={e => setData('role', e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            {roles.map(role => (
                                <option key={role.value} value={role.value}>
                                    {role.label}
                                </option>
                            ))}
                        </select>
                        {errors.role && <div className="text-red-600 text-sm mt-1">{errors.role}</div>}
                    </div>

                    {/* Submit Button */}
                    <div>
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md shadow"
                        >
                            {processing ? 'Updating...' : 'Update'}
                        </button>
                    </div>
                </form>
            </div>
            </div>
        </AppShell>
    );
}
