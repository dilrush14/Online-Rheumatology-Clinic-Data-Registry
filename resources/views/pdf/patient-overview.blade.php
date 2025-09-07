<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>Patient Overview</title>
<style>
  body { font-family: DejaVu Sans, Arial, sans-serif; font-size: 12px; color:#111; }
  h1 { font-size: 18px; margin: 0 0 6px; }
  h2 { font-size: 14px; margin: 16px 0 6px; border-bottom: 1px solid #ddd; padding-bottom: 4px; }
  table { width: 100%; border-collapse: collapse; margin-top: 6px; }
  th, td { border: 1px solid #ddd; padding: 6px; text-align: left; vertical-align: top; }
  .meta { color:#555; }
  .section { margin-top: 12px; }
  .mb-6 { margin-bottom: 12px; }
</style>
</head>
<body>
  <h1>Patient Overview</h1>
  <div class="meta mb-6">
    <div><strong>Name:</strong> {{ $patient->name }} ({{ $patient->national_id }})</div>
    <div><strong>Gender/Age:</strong> {{ $patient->gender ?? '—' }} / {{ $patient->age ?? '—' }}</div>
    <div><strong>Phone:</strong> {{ $patient->phone ?? '—' }}</div>
    @if(!empty($patient->district))
      <div><strong>District:</strong> {{ $patient->district }}</div>
    @endif
  </div>

  {{-- Allergies (only if any) --}}
  @php
    $types = is_array($patient->allergies['types'] ?? null) ? $patient->allergies['types'] : [];
    $note  = $patient->allergies['note'] ?? null;
  @endphp
  @if(count($types) || $note)
    <div class="section">
      <h2>Allergies</h2>
      <div><strong>Types:</strong> {{ count($types) ? implode(', ', array_map('ucfirst',$types)) : '—' }}</div>
      @if($note)
        <div><strong>Note:</strong> {{ $note }}</div>
      @endif
    </div>
  @endif

  {{-- Recent Visits --}}
  @if($visits->count())
    <div class="section">
      <h2>Recent Visits</h2>
      <table>
        <thead><tr><th>Date</th><th>Complaints</th><th>Provisional Dx</th><th>Plan/Notes</th></tr></thead>
        <tbody>
        @foreach($visits as $v)
          <tr>
            <td>{{ optional($v->visit_date)->format('Y-m-d') }}</td>
            <td>
              @if(is_array($v->complaints))
                {{ collect($v->complaints)->map(fn($c)=>($c['code']??'').' — '.($c['title']??''))->implode(', ') }}
              @endif
            </td>
            <td>
              @if(is_array($v->provisional_diagnoses))
                {{ collect($v->provisional_diagnoses)->map(fn($d)=>($d['code']??'').' — '.($d['title']??''))->implode(', ') }}
              @endif
            </td>
            <td>
              @if($v->plan)<div><strong>Plan:</strong> {{ $v->plan }}</div>@endif
              @if($v->notes)<div><strong>Notes:</strong> {{ $v->notes }}</div>@endif
            </td>
          </tr>
        @endforeach
        </tbody>
      </table>
    </div>
  @endif

  {{-- Lab Orders --}}
  @if($labOrders->count())
    <div class="section">
      <h2>Lab Orders & Results</h2>
      @foreach($labOrders as $o)
        <div class="mb-6">
          <div class="meta">
            Ordered: {{ optional($o->ordered_at)->format('Y-m-d H:i') ?? '—' }}
            • Status: {{ $o->status }}
          </div>
          @if(($o->items ?? collect())->count())
            <table>
              <thead><tr><th>Test</th><th>Result</th></tr></thead>
              <tbody>
              @foreach($o->items as $it)
                <tr>
                  <td>{{ $it->test?->code }} — {{ $it->test?->name }}</td>
                  <td>
                    @if($it->result)
                      @if(!is_null($it->result->result_value))
                        Result: <strong>{{ $it->result->result_value }}</strong> {{ $it->result->unit ?? $it->test?->units }}
                        @if($it->result->flag) • Flag: <strong>{{ $it->result->flag }}</strong>@endif
                      @else
                        Panel recorded
                      @endif
                    @else
                      —
                    @endif
                  </td>
                </tr>
              @endforeach
              </tbody>
            </table>
          @endif
        </div>
      @endforeach
    </div>
  @endif

  {{-- Prescriptions --}}
  @if($prescriptions->count())
    <div class="section">
      <h2>Recent Prescriptions</h2>
      @foreach($prescriptions as $p)
        <div class="mb-6">
          <div class="meta">
            {{ optional($p->prescribed_date)->toDateString() ?? '—' }}
            @if($p->diagnosis) • Dx: <strong>{{ $p->diagnosis }}</strong>@endif
          </div>
          @if($p->items->count())
            <table>
              <thead><tr><th>Drug</th><th>Dosage</th><th>Frequency</th><th>Duration</th><th>Route</th></tr></thead>
              <tbody>
              @foreach($p->items as $i)
                <tr>
                  <td>{{ $i->drug_name_cache }}</td>
                  <td>{{ $i->dosage }}</td>
                  <td>{{ $i->frequency }}</td>
                  <td>{{ $i->duration }}</td>
                  <td>{{ $i->route }}</td>
                </tr>
              @endforeach
              </tbody>
            </table>
          @endif
        </div>
      @endforeach
    </div>
  @endif

  {{-- Calculators (each section shows only if it has rows) --}}
  @if($cdai->count())
    <div class="section"><h2>Recent CDAI</h2>
      <table>
        <thead><tr><th>When</th><th>TJC</th><th>SJC</th><th>PtG</th><th>PhG</th><th>Score</th><th>Category</th></tr></thead>
        <tbody>
        @foreach($cdai as $c)
        <tr>
          <td>{{ optional($c->assessed_at)->format('Y-m-d H:i') }}</td>
          <td>{{ $c->tjc28 }}</td><td>{{ $c->sjc28 }}</td><td>{{ $c->ptg }}</td><td>{{ $c->phg }}</td>
          <td>{{ $c->score }}</td><td>{{ $c->category }}</td>
        </tr>
        @endforeach
        </tbody>
      </table>
    </div>
  @endif

  @if($das28->count())
    <div class="section"><h2>Recent DAS28</h2>
      <table>
        <thead><tr><th>When</th><th>Variant</th><th>TJC</th><th>SJC</th><th>Score</th><th>Category</th></tr></thead>
        <tbody>
        @foreach($das28 as $d)
          <tr>
            <td>{{ optional($d->assessed_at)->format('Y-m-d H:i') }}</td>
            <td>{{ $d->variant }}</td>
            <td>{{ $d->tjc28 }}</td>
            <td>{{ $d->sjc28 }}</td>
            <td>{{ $d->score }}</td>
            <td>{{ $d->category }}</td>
          </tr>
        @endforeach
        </tbody>
      </table>
    </div>
  @endif

  @if($sdai->count())
    <div class="section"><h2>Recent SDAI</h2>
      <table>
        <thead><tr><th>When</th><th>TJC</th><th>SJC</th><th>PtG</th><th>PhG</th><th>CRP</th><th>Score</th></tr></thead>
        <tbody>
        @foreach($sdai as $s)
          <tr>
            <td>{{ optional($s->assessed_at)->format('Y-m-d H:i') }}</td>
            <td>{{ $s->tjc28 }}</td><td>{{ $s->sjc28 }}</td><td>{{ $s->pt_global }}</td>
            <td>{{ $s->ph_global }}</td><td>{{ $s->crp }}</td><td>{{ $s->score }}</td>
          </tr>
        @endforeach
        </tbody>
      </table>
    </div>
  @endif

  @if($basdai->count())
    <div class="section"><h2>Recent BASDAI</h2>
      <table>
        <thead><tr><th>When</th><th>Q1–Q6</th><th>Score</th></tr></thead>
        <tbody>
        @foreach($basdai as $b)
          <tr>
            <td>{{ optional($b->assessed_at)->format('Y-m-d H:i') }}</td>
            <td>{{ "{$b->q1}, {$b->q2}, {$b->q3}, {$b->q4}, {$b->q5}, {$b->q6}" }}</td>
            <td>{{ $b->score }}</td>
          </tr>
        @endforeach
        </tbody>
      </table>
    </div>
  @endif

  @if($asdas->count())
    <div class="section"><h2>Recent ASDAS-CRP</h2>
      <table>
        <thead><tr><th>When</th><th>Back pain</th><th>Stiffness</th><th>Pt Global</th><th>Peripheral</th><th>CRP</th><th>Score</th></tr></thead>
        <tbody>
        @foreach($asdas as $a)
          <tr>
            <td>{{ optional($a->assessed_at)->format('Y-m-d H:i') }}</td>
            <td>{{ $a->back_pain }}</td><td>{{ $a->morning_stiffness_duration }}</td><td>{{ $a->pt_global }}</td>
            <td>{{ $a->peripheral_pain_swelling }}</td><td>{{ $a->crp }}</td><td>{{ $a->score }}</td>
          </tr>
        @endforeach
        </tbody>
      </table>
    </div>
  @endif

  @if($haqdi->count())
    <div class="section"><h2>Recent HAQ-DI</h2>
      <table>
        <thead><tr><th>When</th><th>Score</th></tr></thead>
        <tbody>
        @foreach($haqdi as $h)
          <tr><td>{{ optional($h->assessed_at)->format('Y-m-d H:i') }}</td><td>{{ $h->score }}</td></tr>
        @endforeach
        </tbody>
      </table>
    </div>
  @endif

  @if($dapsa->count())
    <div class="section"><h2>Recent DAPSA</h2>
      <table>
        <thead><tr><th>When</th><th>TJC68</th><th>SJC66</th><th>Pt Global</th><th>Pain VAS</th><th>CRP</th><th>Score</th></tr></thead>
        <tbody>
        @foreach($dapsa as $d)
          <tr>
            <td>{{ optional($d->assessed_at)->format('Y-m-d H:i') }}</td>
            <td>{{ $d->tjc68 }}</td><td>{{ $d->sjc66 }}</td><td>{{ $d->pt_global }}</td>
            <td>{{ $d->pain }}</td><td>{{ $d->crp }}</td><td>{{ $d->score }}</td>
          </tr>
        @endforeach
        </tbody>
      </table>
    </div>
  @endif

  @if($vas->count())
    <div class="section"><h2>Recent VAS</h2>
      <table>
        <thead><tr><th>When</th><th>Label</th><th>Value (0–100)</th></tr></thead>
        <tbody>
        @foreach($vas as $v)
          <tr>
            <td>{{ optional($v->assessed_at)->format('Y-m-d H:i') }}</td>
            <td>{{ $v->label ?? 'Global health' }}</td>
            <td>{{ $v->value }}</td>
          </tr>
        @endforeach
        </tbody>
      </table>
    </div>
  @endif

  @if($bmi->count())
    <div class="section"><h2>Recent BMI</h2>
      <table>
        <thead><tr><th>When</th><th>Weight (kg)</th><th>Height (m)</th><th>BMI</th><th>Band</th></tr></thead>
        <tbody>
        @foreach($bmi as $x)
          <tr>
            <td>{{ optional($x->assessed_at)->format('Y-m-d H:i') }}</td>
            <td>{{ $x->weight_kg }}</td>
            <td>{{ $x->height_m }}</td>
            <td>{{ $x->bmi }}</td>
            <td>{{ $x->band }}</td>
          </tr>
        @endforeach
        </tbody>
      </table>
    </div>
  @endif

  @if($eular->count())
    <div class="section"><h2>Recent EULAR Response</h2>
      <table>
        <thead><tr><th>When</th><th>Baseline DAS28</th><th>Current DAS28</th><th>Δ</th><th>Response</th></tr></thead>
        <tbody>
        @foreach($eular as $r)
          <tr>
            <td>{{ optional($r->assessed_at)->format('Y-m-d H:i') }}</td>
            <td>{{ $r->baseline_das28 }}</td>
            <td>{{ $r->current_das28 }}</td>
            <td>{{ $r->delta }}</td>
            <td>{{ $r->response }}</td>
          </tr>
        @endforeach
        </tbody>
      </table>
    </div>
  @endif
</body>
</html>
