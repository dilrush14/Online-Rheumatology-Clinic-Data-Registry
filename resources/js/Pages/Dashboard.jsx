import { Head } from '@inertiajs/react';
import AppShell from '@/components/app-shell';


export default function Dashboard() {
    return (
        <AppShell>
            <Head title="Dashboard" />

            <h1 className="text-2xl font-bold text-gray-800 mb-4">
                General Dashboard
            </h1>

            <div className="bg-white p-6 rounded shadow">
                This is the admin/doctor/etc dashboard content.
            </div>
        </AppShell>
    );
}


        
   