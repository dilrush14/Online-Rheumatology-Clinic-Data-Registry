import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import AppShell from '@/components/app-shell';
import PageHeader from '@/components/page-header';

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <AppShell>
            <PageHeader title="My Profile" />
            <div className="space-y-6">
                <div className="bg-white p-6 rounded shadow">
                    <UpdateProfileInformationForm mustVerifyEmail={mustVerifyEmail} status={status} />
                </div>
                <div className="bg-white p-6 rounded shadow">
                    <UpdatePasswordForm />
                </div>
                <div className="bg-white p-6 rounded shadow">
                    <DeleteUserForm />
                </div>
            </div>
        </AppShell>
    );
}