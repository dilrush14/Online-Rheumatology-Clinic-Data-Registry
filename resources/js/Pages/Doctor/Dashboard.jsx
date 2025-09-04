import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

import React from 'react';
import { route } from 'ziggy-js';
import AppShell from '@/components/app-shell';

export default function Dashboard({ auth }) {
    return (
        <AppShell
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Doctor Dashboard</h2>}
        >
            <Head title="Doctor Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">Welcome, Dr. {auth.user.name}</div>
                    </div>
 
                    <div className="mt-6">
                    <Link href={route('doctor.patients.index')} className="btn btn-primary">Index</Link>

                    </div>
                    
                </div>
            </div>
        </AppShell>
    );
}
