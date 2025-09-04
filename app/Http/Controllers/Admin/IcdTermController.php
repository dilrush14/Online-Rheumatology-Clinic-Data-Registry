<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\IcdTerm;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class IcdTermController extends Controller
{
    /** Web list (with search + category filter) */
    public function index(Request $request)
    {
        $search   = trim((string) $request->query('search', ''));
        $category = trim((string) $request->query('category', '')); // 'complaint'|'diagnosis'|''

        $terms = IcdTerm::query()
            ->when($search !== '', fn ($q) =>
                $q->where(fn ($w) =>
                    $w->where('code', 'like', "%{$search}%")
                      ->orWhere('title', 'like', "%{$search}%")
                )
            )
            ->when($category !== '', fn ($q) => $q->where('category', $category))
            ->orderBy('code')
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('Admin/IcdTerms/Index', [
            'terms'   => $terms,
            'filters' => ['search' => $search, 'category' => $category],
        ]);
    }

    /** Web create form */
    public function create()
    {
        return Inertia::render('Admin/IcdTerms/Create');
    }

    /** Web store */
    public function store(Request $request)
    {
        $data = $request->validate([
            'code'      => ['required', 'string', 'max:32', 'unique:icd_terms,code'],
            'title'     => ['required', 'string', 'max:512'],
            'category'  => ['required', Rule::in(['complaint', 'diagnosis'])],
            'is_active' => ['boolean'],
        ]);
        $data['is_active'] = (bool) ($data['is_active'] ?? true);

        IcdTerm::create($data);

        return redirect()
            ->route('admin.icd-terms.index')
            ->with('success', 'ICD term added.');
    }

    /** Web edit form */
    public function edit(IcdTerm $icd_term)
    {
        return Inertia::render('Admin/IcdTerms/Edit', [
            'term' => $icd_term->only(['id', 'code', 'title', 'category', 'is_active']),
        ]);
    }

    /** Web update */
    public function update(Request $request, IcdTerm $icd_term)
    {
        $data = $request->validate([
            'code'      => ['required', 'string', 'max:32', Rule::unique('icd_terms', 'code')->ignore($icd_term->id)],
            'title'     => ['required', 'string', 'max:512'],
            'category'  => ['required', Rule::in(['complaint', 'diagnosis'])],
            'is_active' => ['boolean'],
        ]);
        $data['is_active'] = (bool) ($data['is_active'] ?? true);

        $icd_term->update($data);

        return redirect()
            ->route('admin.icd-terms.index')
            ->with('success', 'ICD term updated.');
    }

    /** Web delete */
    public function destroy(IcdTerm $icd_term)
    {
        $icd_term->delete();

        return redirect()
            ->route('admin.icd-terms.index')
            ->with('success', 'ICD term deleted.');
    }

    /** JSON for selects (doctor forms etc.) */
    public function apiList(Request $request)
    {
        $q        = trim((string) $request->query('search', ''));
        $category = trim((string) $request->query('category', '')); // optional
        $limit    = (int) $request->query('limit', 20);

        $terms = IcdTerm::query()
            ->when($category !== '', fn ($qq) => $qq->where('category', $category))
            ->when($q !== '', fn ($qq) =>
                $qq->where(fn ($w) =>
                    $w->where('code', 'like', "%{$q}%")
                      ->orWhere('title', 'like', "%{$q}%")
                )
            )
            ->where('is_active', true)
            ->orderBy('title')
            ->limit($limit)
            ->get(['id', 'code', 'title', 'category']);

        return response()->json(
            $terms->map(fn ($t) => [
                'code'     => $t->code,
                'title'    => $t->title,
                'label'    => "{$t->code} — {$t->title}",
                'value'    => $t->code,
                'category' => $t->category,
            ])
        );
    }
}
