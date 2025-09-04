
import { useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
export default function DeleteButton({ userId, icon }) {
    const { delete: destroy } = useForm();

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this user?')) {
            destroy(route('admin.users.destroy', userId));
        }
    };

    return (
        <button onClick={handleDelete} className="focus:outline-none">
            {icon}
        </button>
    );
}
