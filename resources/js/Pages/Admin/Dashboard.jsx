import { Link, Head } from '@inertiajs/react';
import AppShell from '@/components/app-shell';
import React from 'react';
import { route } from 'ziggy-js';
import PageHeader from '@/components/page-header';
/*
export default function Dashboard() {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Admin Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            hi Admin You're logged in!
                        </div>

                        <div className="mt-6">
                              <Link href={route('admin.users.index')} className="btn btn-primary">
                                Manage Users
                           </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}*/
export default function Dashboard() {
    return (
        <AppShell>
            <PageHeader title="Admin Dashboard"/>

            <div className="bg-white p-6 rounded shadow">
                <p className="mb-4">Hi Admin, you're logged in!</p>

                
            </div>
        </AppShell>
    );
}