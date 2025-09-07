<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Patient;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    private function patientStats(): array
    {
        $today = Patient::whereDate('created_at', now()->toDateString())->count();
        $month = Patient::whereYear('created_at', now()->year)
                        ->whereMonth('created_at', now()->month)
                        ->count();
        $year  = Patient::whereYear('created_at', now()->year)->count();

        // Last 7 days (including today), fill gaps with 0
        $raw = DB::table('patients')
            ->select(DB::raw('DATE(created_at) as date'), DB::raw('COUNT(*) as count'))
            ->where('created_at', '>=', now()->subDays(6)->startOfDay())
            ->groupBy(DB::raw('DATE(created_at)'))
            ->pluck('count', 'date');

        $weekly = collect(range(6, 0))->map(function ($i) use ($raw) {
            $d = now()->subDays($i)->toDateString();
            return ['date' => $d, 'count' => (int) ($raw[$d] ?? 0)];
        })->values();

        return [
            'patients' => compact('today','month','year'),
            'weeklyRegistrations' => $weekly,
        ];
    }

    public function doctor()
    {
        return Inertia::render('Doctor/Dashboard', [
            'stats' => $this->patientStats(),
        ]);
    }

    public function nurse()
    {
        return Inertia::render('Nurse/Dashboard', [
            'stats' => $this->patientStats(),
        ]);
    }

    public function consultant()
    {
        return Inertia::render('Consultant/Dashboard', [
            'stats' => $this->patientStats(),
        ]);
    }
}
