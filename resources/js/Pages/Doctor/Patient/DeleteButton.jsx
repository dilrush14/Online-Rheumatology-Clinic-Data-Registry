import React from 'react';
import { router } from '@inertiajs/react';
import { route } from 'ziggy-js';

export default function DeleteButton({
  patientId,
  className = '',
  children,
  label = 'Delete',
  confirmText = 'Are you sure you want to delete this patient? This action cannot be undone.',
  onDeleted, // optional callback
}) {
  const handleDelete = () => {
    if (!patientId) return;

    if (window.confirm(confirmText)) {
      router.delete(route('doctor.patients.destroy', patientId), {
        preserveScroll: true,
        onSuccess: () => {
          if (typeof onDeleted === 'function') onDeleted();
        },
      });
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      className={className || 'text-red-600 hover:text-red-800'}
      title="Delete"
    >
      {children || label}
    </button>
  );
}
