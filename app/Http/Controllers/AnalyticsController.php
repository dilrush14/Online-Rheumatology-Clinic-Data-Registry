<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\Visit;
use App\Models\Patient;
use App\Models\Das28Assessment;

class AnalyticsController extends Controller
{
    public function index()
    {
        // ---- existing ICD-11 aggregation (kept from before) ----
        $visits = Visit::query()->get(['patient_id','provisional_diagnoses']);

        $byCode = [];
        foreach ($visits as $v) {
            $arr = $v->provisional_diagnoses;
            if (!is_array($arr) || empty($arr)) continue;

            foreach ($arr as $pd) {
                $code  = isset($pd['code']) ? trim((string)$pd['code']) : '';
                $title = isset($pd['title']) ? trim((string)$pd['title']) : '';
                if ($code === '') continue;

                if (!isset($byCode[$code])) {
                    $byCode[$code] = ['title' => $title, 'patients' => []];
                }
                $byCode[$code]['title'] = $byCode[$code]['title'] ?: $title;
                $byCode[$code]['patients'][$v->patient_id] = true;
            }
        }

        $rows = [];
        foreach ($byCode as $code => $info) {
            $rows[] = [
                'code' => $code,
                'title' => $info['title'] ?: '',
                'patient_count' => count($info['patients']),
            ];
        }
        usort($rows, fn($a,$b) => $b['patient_count'] <=> $a['patient_count']);

        return Inertia::render('Analytics/Index', [
            'icdCounts'   => $rows,
            'generatedAt' => now()->toDateTimeString(),
        ]);
    }

    // ---- NEW: quick patient search for the analytics card ----
    public function patientSearch(Request $request)
    {
        $q = trim((string) $request->query('q', ''));
        if ($q === '') return response()->json([]);

        $matches = Patient::query()
            ->where(function($w) use ($q) {
                $w->where('name','like',"%{$q}%")
                  ->orWhere('national_id','like',"%{$q}%")
                  ->orWhere('phone','like',"%{$q}%");
            })
            ->orderBy('name')
            ->limit(10)
            ->get(['id','name','national_id']);

        $out = $matches->map(fn($p)=>[
            'id'    => $p->id,
            'label' => trim($p->name.' — '.$p->national_id),
        ]);

        return response()->json($out);
    }

    // ---- NEW: DAS28 series for a patient (JSON used by the chart) ----
    public function patientDas28(Patient $patient)
    {
        $rows = Das28Assessment::where('patient_id', $patient->id)
            ->orderBy('assessed_at')
            ->orderBy('id')
            ->get(['id','variant','score','assessed_at']);

        return response()->json([
            'patient' => ['id'=>$patient->id,'name'=>$patient->name,'national_id'=>$patient->national_id],
            'series'  => $rows->map(fn($r)=>[
                'id'          => $r->id,
                'assessed_at' => optional($r->assessed_at)->toDateTimeString(),
                'score'       => is_null($r->score) ? null : (float) $r->score,
                'variant'     => $r->variant,
            ]),
        ]);
    }
}
