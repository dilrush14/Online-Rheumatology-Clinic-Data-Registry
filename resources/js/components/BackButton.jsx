import React from 'react';
import { Link } from '@inertiajs/react';

export default function BackButton({ href = '/admin/users' }) {
    return (
        <Link
            href={href}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md text-sm font-medium"
        >
            ← Back
        </Link>
    );
}
