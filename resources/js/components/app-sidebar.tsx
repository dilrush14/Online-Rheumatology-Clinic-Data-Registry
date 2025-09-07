import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import {
  LayoutGrid,
  Clipboard,
  User as UserIcon,
  FileText,
  BarChart,
  FileSearch,
} from 'lucide-react';
import type { PageProps as InertiaPageProps } from '@inertiajs/core';

/** ---------- Types ---------- */

type Role = 'admin' | 'doctor' | 'nurse' | 'consultant' | string;

type IconType = React.ComponentType<{
  size?: number;
  color?: string;
  className?: string;
}>;

type ActiveWhen = string | string[] | null | undefined;

interface NavLink {
  label: string;
  href: string;
  activeWhen?: ActiveWhen;
  icon?: IconType;
}

interface NavSection {
  title: string;
  links: NavLink[];
}

/** Extend Inertia's PageProps so it satisfies the generic constraint */
type AppPageProps = InertiaPageProps & {
  auth?: {
    user?: {
      name?: string;
      role?: Role;
    };
  };
  sidebar?: {
    links?: NavLink[];
  };
};

/** ---------- Small components ---------- */

function NavGroup({ title, links }: { title: string; links: NavLink[] }) {
  return (
    <div>
      <p className="px-3 text-xs text-gray-500 font-semibold uppercase mb-2">{title}</p>
      <div className="space-y-1">
        {links.map(({ label, href, activeWhen, icon: Icon }, i: number) => {
          const isActive =
            Array.isArray(activeWhen)
              ? activeWhen.some((pat) => (pat ? route().current(pat) : false))
              : activeWhen
              ? route().current(activeWhen)
              : false;

          return (
            <Link
              key={`${label}-${i}`}
              href={href}
              className={`flex items-center gap-2 px-3 py-2 rounded-md border-l-4 transition ${
                isActive
                  ? 'bg-indigo-200 border-indigo-500 text-indigo-900 font-semibold'
                  : 'border-transparent text-gray-700 hover:bg-indigo-100 hover:text-indigo-900'
              }`}
            >
              {Icon ? <Icon size={16} /> : null}
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

/** ---------- Sidebar ---------- */

export default function AppSidebar() {
  const { auth, sidebar } = usePage<AppPageProps>().props;
  const role: Role = auth?.user?.role ?? 'user';
  const displayName = auth?.user?.name ?? 'User';

  // Global (everyone)
  const globalNav: NavSection[] = [
    {
      title: 'Account',
      links: [
        {
          label: 'My Profile',
          href: route('profile.edit'),
          activeWhen: 'profile.edit',
          icon: FileText,
        },
      ],
    },
  ];

  // Admin
  const adminNav: NavSection[] = [
    {
      title: 'Admin',
      links: [
        {
          label: 'Dashboard',
          href: route('admin.dashboard'),
          activeWhen: 'admin.dashboard',
          icon: LayoutGrid,
        },
        {
          label: 'Manage Users',
          href: route('admin.users.index'),
          activeWhen: ['admin.users.*'],
          icon: UserIcon,
        },
        {
          label: 'ICD Terms',
          href: route('admin.icd-terms.index'),
          activeWhen: ['admin.icd-terms.*'],
          icon: FileSearch,
        },
      ],
    },
    {
      title: 'Patient Overview',
      links: [
        {
          label: 'Patients',
          href: route('doctor.patients.index'),
          activeWhen: ['doctor.patients.*'],
          icon: Clipboard,
        },
      ],
    },
  ];

  // Doctor
  const doctorNav: NavSection[] = [
    {
      title: 'Doctor',
      links: [
        {
          label: 'Dashboard',
          href: route('doctor.dashboard'),
          activeWhen: 'doctor.dashboard',
          icon: LayoutGrid,
        },
      ],
    },
    {
      title: 'Patient Overview',
      links: [
        {
          label: 'Patients',
          href: route('doctor.patients.index'),
          activeWhen: ['doctor.patients.*'],
          icon: Clipboard,
        },
      ],
    },
  ];

  // Nurse
  const nurseNav: NavSection[] = [
    {
      title: 'Nurse',
      links: [
        { label: 'Dashboard', href: route('nurse.dashboard'), activeWhen: 'nurse.dashboard', icon: LayoutGrid },
      ],
    },
    {
      title: 'Patient Overview',
      links: [
        {
          label: 'Patients',
          href: route('doctor.patients.index'),
          activeWhen: ['doctor.patients.*'],
          icon: Clipboard,
        },
      ],
    },
  ];

  // Consultant
  const consultantNav: NavSection[] = [
    {
      title: 'Consultant',
      links: [
        { label: 'Dashboard', href: route('consultant.dashboard'), activeWhen: 'consultant.dashboard', icon: LayoutGrid },
      ],
    },
    {
      title: 'Patient Overview',
      links: [
        {
          label: 'Patients',
          href: route('doctor.patients.index'),
          activeWhen: ['doctor.patients.*'],
          icon: Clipboard,
        },
      ],
    },
  ];

  // Shared "Data Analysis" section for admin, doctor, consultant
  const analysisNav: NavSection = {
    title: 'Insights',
    links: [
      {
        label: 'Data Analysis',
        href: route('analytics.index'),
        activeWhen: ['analytics.*'],
        icon: BarChart,
      },
    ],
  };

  const roleNav: NavSection[] =
    role === 'admin'
      ? adminNav
      : role === 'doctor'
      ? doctorNav
      : role === 'nurse'
      ? nurseNav
      : role === 'consultant'
      ? consultantNav
      : [];

  //  const showAnalysis = ['admin', 'doctor', 'consultant'].includes(role);
  // Only Admin & Consultant should see "Data Analysis"
  const showAnalysis = role === 'admin' || role === 'consultant';

  const navGroups: NavSection[] = [
    ...globalNav,
    ...roleNav,
    ...(showAnalysis ? [analysisNav] : []),
  ];

  return (
    <aside className="w-64 bg-indigo-50 text-sm min-h-screen border-r border-gray-300 flex flex-col">
      <div className="p-4 bg-indigo-100 border-b border-indigo-300 text-indigo-900">
        <h2 className="text-lg font-semibold">{displayName}</h2>
        <p className="text-sm capitalize">{role}</p>
      </div>

      <nav className="flex-1 overflow-y-auto p-2 space-y-6">
        {navGroups.map((group, idx: number) => (
          <NavGroup key={idx} title={group.title} links={group.links} />
        ))}

        {/* Contextual (e.g., patient-specific links passed from controller) */}
        {sidebar?.links?.length ? (
          <NavGroup title="This Patient" links={sidebar.links} />
        ) : null}
      </nav>
    </aside>
  );
}
