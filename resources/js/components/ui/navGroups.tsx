import {
  LayoutGrid,
  Clipboard,
  User,
  FileText
} from 'lucide-react';

const navGroups = [
  {
    title: 'Main',
    links: [
      { label: 'Dashboard', href: '/dashboard', icon: <LayoutGrid size={16} /> },
      { label: 'Users', href: '/admin/users', icon: <User size={16} /> },
    ],
  },
  {
    title: 'Clinic Actions',
    links: [
      { label: 'Overview', href: '/clinic/overview', icon: <Clipboard size={16} /> },
      { label: 'Diagnoses', href: '/clinic/diagnoses', icon: <FileText size={16} /> },
    ],
  },
];
