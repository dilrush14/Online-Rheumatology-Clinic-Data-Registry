import React, { useState, useEffect, useMemo } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import AppShell from '@/components/app-shell';
import PageHeader from '@/components/page-header';
import DeleteButton from './DeleteButton';
import { Pencil, Trash2 } from 'lucide-react';
import debounce from 'lodash.debounce'; // ✅ Import debounce

export default function Index() {
    const { users } = usePage().props;
    const [search, setSearch] = useState('');
    const [filteredUsers, setFilteredUsers] = useState(users);

    // ✅ Debounced search function
    const debouncedFilter = useMemo(() => 
        debounce((query) => {
            const filtered = users.filter((user) =>
                `${user.name} ${user.email} ${user.role_label}`
                    .toLowerCase()
                    .includes(query.toLowerCase())
            );
            setFilteredUsers(filtered);
        }, 300), // Delay in ms
    [users]);

    // ✅ Trigger debounce on search input
    useEffect(() => {
        debouncedFilter(search);
        return () => debouncedFilter.cancel(); // Clean up on unmount
    }, [search]);

    return (
        <AppShell>
            <PageHeader
                title="User Management"
                actions={

                    
                    <Link
                        href={route('admin.users.create')}
                        className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700"
                    >
                        + Add User
                    </Link>
                }
            />

            <div className="flex justify-end mb-4">
                <input
                    type="text"
                    placeholder="Search users..."
                    className="border px-3 py-2 rounded w-1/3"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="p-6">
                <div className="overflow-x-auto">
                    <table className="table-fixed w-full border border-black text-sm border-collapse">
                        <thead>
                            <tr className="text-center bg-blue-200">
                                <th className="w-1/6 border border-black px-2 py-1">ID</th>
                                <th className="w-4/6 border border-black px-2 py-1">Name</th>
                                <th className="w-5/6 border border-black px-2 py-1">Email</th>
                                <th className="w-2/6 border border-black px-2 py-1">Role</th>
                                <th className="w-1/6 border border-black px-2 py-1">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user, index) => (
                                <tr
                                    key={user.id}
                                    className={`border-t text-left hover:bg-blue-50 ${
                                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                    }`}
                                >
                                    <td className="border border-black px-2 py-1">{user.id}</td>
                                    <td className="border border-black px-2 py-1">{user.name}</td>
                                    <td className="border border-black px-2 py-1">{user.email}</td>
                                    <td className="border border-black px-2 py-1">{user.role_label}</td>
                                    <td className="border border-black px-2 py-1">
                                        <div className="flex items-center space-x-2">
                                            <Link
                                                href={route('admin.users.edit', user.id)}
                                                className="text-blue-600 hover:text-blue-800"
                                            >
                                                <Pencil size={16} />
                                            </Link>
                                            <DeleteButton
                                                userId={user.id}
                                                icon={
                                                    <Trash2
                                                        size={16}
                                                        className="text-red-600 hover:text-red-800"
                                                    />
                                                }
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppShell>
    );
}
