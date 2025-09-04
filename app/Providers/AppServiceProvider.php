<?php

namespace App\Providers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;
use App\Enums\UserRole;


class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    /*public function boot(): void
    {
       Inertia::share([
        'auth' => function () {
            return [
                'user' => auth()->user(),
            ];
        },
    ]); 
        Vite::prefetch(concurrency: 3);
    }*/

public function boot(): void
{
    Inertia::share([
        'auth' => fn () => ['user' => Auth::user()],
        'nav' => function () {
            $user = Auth::user();

            if (!$user) return [];

            return match ($user->role) {
                UserRole::ADMIN => [
                    'Dashboard' => route('admin.dashboard'),
                    'Users' => route('admin.users.index'), 
                    // 'Settings' => route('admin.settings'), // ⛔ remove if not defined
                ],
                UserRole::DOCTOR => [
                    'Dashboard' => route('doctor.dashboard'),
                    'Patients' => route('doctor.patients.index'), 
                    // 'Schedule' => route('doctor.schedule'), // remove or define
                ],
                UserRole::NURSE => [
                    'Dashboard' => route('nurse.dashboard'),
                    //'Assignments' => route('nurse.assignments'), // check if exists
                ],
                UserRole::CONSULTANT => [
                    'Dashboard' => route('consultant.dashboard'), // check

                ],
                
                default => [],
            };
        },
    ]);

    Vite::prefetch(concurrency: 3);
}


}



    
