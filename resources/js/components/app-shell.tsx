import { SidebarProvider } from '@/components/ui/sidebar';
import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';

import { AppHeader } from './app-header';
import AppSidebar from './app-sidebar';



interface AppShellProps {
    children: React.ReactNode;
    variant?: 'header' | 'sidebar';
}


export default function AppShell({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            {/* TOP HEADER */}
            <AppHeader />

            {/* MAIN CONTENT AREA: sidebar + content */}
            <div className="flex flex-1">
                <AppSidebar />

                <main className="flex-1 p-6 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}