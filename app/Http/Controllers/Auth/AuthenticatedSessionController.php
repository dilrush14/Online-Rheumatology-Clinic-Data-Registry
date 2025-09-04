<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;
use App\Enums\UserRole;

class AuthenticatedSessionController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    public function store(LoginRequest $request): RedirectResponse
            {
                $request->authenticate();
                $request->session()->regenerate();

                $user = Auth::user();

                return match ($user->role) {
                    UserRole::ADMIN => redirect()->route('admin.dashboard'),
                    UserRole::DOCTOR => redirect()->route('doctor.dashboard'),
                    UserRole::NURSE => redirect()->route('nurse.dashboard'),
                    UserRole::CONSULTANT => redirect()->route('consultant.dashboard'),
                    default => redirect()->route('dashboard'),
                };
            }

    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
