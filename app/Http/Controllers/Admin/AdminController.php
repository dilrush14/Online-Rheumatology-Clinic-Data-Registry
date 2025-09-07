<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use App\Models\Patient;
use Illuminate\Support\Facades\DB;
use App\Enums\UserRole;

class AdminController extends Controller
{
    public function dashboard()
    {
        // Patients registered counts
        $today = Patient::whereDate('created_at', now()->toDateString())->count();
        $month = Patient::whereYear('created_at', now()->year)
                        ->whereMonth('created_at', now()->month)
                        ->count();
        $year  = Patient::whereYear('created_at', now()->year)->count();
        $total = Patient::count();

        // Last 7 days, fill missing days with 0
        $raw = DB::table('patients')
            ->select(DB::raw('DATE(created_at) as date'), DB::raw('COUNT(*) as count'))
            ->where('created_at', '>=', now()->subDays(6)->startOfDay())
            ->groupBy(DB::raw('DATE(created_at)'))
            ->orderBy('date')
            ->get()
            ->keyBy('date');

        $weekly = collect(range(6, 0))->map(function ($i) use ($raw) {
            $d = now()->subDays($i)->toDateString();
            return ['date' => $d, 'count' => (int) ($raw[$d]->count ?? 0)];
        })->values();

        // Users by role (use query builder to avoid enum casting)
        $userRoles = DB::table('users')
            ->select('role', DB::raw('COUNT(*) as count'))
            ->groupBy('role')
            ->orderBy('role')
            ->get()
            ->map(function ($row) {
                $role  = (string) $row->role; // plain value from DB
                $label = UserRole::tryFrom($role)?->label() ?? ucfirst($role);
                return ['role' => $role, 'label' => $label, 'count' => (int) $row->count];
            })
            ->values();

        return Inertia::render('Admin/Dashboard', [
            'adminStats' => [
                'patients'            => compact('today','month','year','total'),
                'weeklyRegistrations' => $weekly,
                'userRoles'           => $userRoles,
            ],
        ]);
    }
}
