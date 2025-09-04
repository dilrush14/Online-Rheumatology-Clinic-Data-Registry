import { useForm } from '@inertiajs/react';
import { Head, Link } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';


export default function Register() {
  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: 'user', // Add this line
});

    const submit = (e) => {
        e.preventDefault();
        console.log('Submitting data:', data);

        post('/register', {
            onSuccess: () => {
                console.log('Registered successfully!');
                reset('password', 'password_confirmation');
            },
            onError: (err) => {
                console.log('Validation errors:', err);
            },
        });
    };

    return (
    <GuestLayout>
            <Head title="Register" />
            <h1 className="text-2xl font-bold mb-4">Register</h1>
            <form onSubmit={submit} className="space-y-4">
                <div>
                    <label>Name</label>
                    <input
                        type="text"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        className="border rounded w-full"
                        required
                    />
                    {errors.name && <div className="text-red-500">{errors.name}</div>}
                </div>

                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        className="border rounded w-full"
                        required
                    />
                    {errors.email && <div className="text-red-500">{errors.email}</div>}
                </div>

                <div>
                    <label>Password</label>
                    <input
                        type="password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        className="border rounded w-full"
                        required
                    />
                    {errors.password && <div className="text-red-500">{errors.password}</div>}
                </div>

                <div>
                    <label>Confirm Password</label>
                    <input
                        type="password"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        className="border rounded w-full"
                        required
                    />
                </div>

                <div className="flex items-center justify-between">
                    <Link href="/login" className="text-blue-500 underline">
                        Already registered?
                    </Link>
                    <button
                        type="submit"
                        disabled={processing}
                        className="bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        Register
                    </button>
                </div>
            </form>
        </GuestLayout>
    );
}
