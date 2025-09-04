import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';


export function NavMain() {
    const { auth } = usePage().props as any;

    return (
        <header className="w-full bg-white border-b p-4 flex justify-between items-center">
            <div className="font-bold">Rheuma Admin</div>
            <div>
                {auth?.user?.name} ({auth?.user?.role})
                <Link href={route('logout')} method="post" className="ml-4 text-red-600">
                    Logout
                </Link>
            </div>
        </header>
    );
}
