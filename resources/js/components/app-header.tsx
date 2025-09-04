import React, { useEffect, useRef, useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { route } from 'ziggy-js';

export function AppHeader() {
  const { auth } = usePage().props as any;
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const menuRef = useRef<HTMLDivElement | null>(null);
  const btnRef = useRef<HTMLButtonElement | null>(null);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    // ✅ Call the GLOBAL route so any role can search
    router.get(route('patients.quick-search'), { q }, { preserveState: true });
  };

  // Close on outside click
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!open) return;
      const t = e.target as Node;
      if (menuRef.current && !menuRef.current.contains(t) && btnRef.current && !btnRef.current.contains(t)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  return (
    <header className="bg-indigo-600 text-white shadow">
      <div className="mx-auto flex h-16 max-w-screen-xl items-center justify-between px-4 gap-4">
        {/* Brand */}
        <div className="font-bold text-lg whitespace-nowrap">
          Rheumatology Clinic Data Registry
        </div>

        {/* Search */}
        <form role="search" aria-label="Patient quick search" onSubmit={onSubmit} className="flex-1 max-w-xl w-full">
          <div className="relative">
            <label htmlFor="global-search" className="sr-only">Search patients</label>
            <input
              id="global-search"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search patients by name / NIC / phone / district…"
              className="w-full rounded-md border border-indigo-300 bg-white/95 px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-white"
            />
            <button
              type="submit"
              className="absolute right-1 top-1/2 -translate-y-1/2 rounded-md bg-indigo-700 px-3 py-1.5 text-sm font-medium hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-white"
            >
              Search
            </button>
          </div>
        </form>

        {/* User menu */}
        <div className="relative">
          <button
            ref={btnRef}
            type="button"
            aria-haspopup="menu"
            aria-expanded={open}
            aria-controls="user-menu"
            onClick={() => setOpen((o) => !o)}
            className="rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-white"
          >
            {auth.user.name} ▾
          </button>

          {open && (
            <div
              ref={menuRef}
              id="user-menu"
              role="menu"
              aria-labelledby="user-menu-button"
              tabIndex={-1}
              className="absolute right-0 mt-2 w-48 rounded border bg-white text-gray-800 shadow z-10 p-1"
            >
              <Link
                role="menuitem"
                tabIndex={0}
                href={route('profile.edit')}
                className="block rounded px-4 py-2 text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
              >
                Profile
              </Link>
              <Link
                role="menuitem"
                tabIndex={0}
                href={route('logout')}
                method="post"
                as="button"
                className="block w-full text-left rounded px-4 py-2 text-sm text-red-600 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
              >
                Log Out
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
