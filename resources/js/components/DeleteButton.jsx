import React from 'react';
import { router } from '@inertiajs/react';

export default function DeleteButton({ href, confirmText = 'Delete?', className = '', children }) {
  const onClick = () => {
    if (!confirm(confirmText)) return;
    router.delete(href, { preserveScroll: true });
  };
  return (
    <button type="button" onClick={onClick} className={className}>
      {children || 'Delete'}
    </button>
  );
}
