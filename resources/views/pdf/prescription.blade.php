<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>Prescription #{{ $p->id }}</title>
<style>
 body { font-family: DejaVu Sans, sans-serif; font-size: 12px; }
 h1 { font-size: 18px; margin: 0 0 6px; }
 table { width: 100%; border-collapse: collapse; margin-top: 8px; }
 th, td { border: 1px solid #555; padding: 6px; text-align: left; vertical-align: top; }
 .muted { color: #555; }
 .small { font-size: 11px; }
</style>
</head>
<body>
  <h1>Prescription</h1>
  <div class="small">
    Patient: <strong>{{ $p->patient->name }}</strong> ({{ $p->patient->national_id }})<br>
    Date: <strong>{{ optional($p->prescribed_date)->format('Y-m-d') ?? $p->created_at->format('Y-m-d') }}</strong>
  </div>

  <p class="small">
    Diagnosis: <strong>{{ $p->diagnosis ?? '—' }}</strong>
    @if($p->diagnosis_code) ({{ $p->diagnosis_code }}) @endif
  </p>

  <table>
    <thead>
      <tr>
        <th style="width:35%">Drug</th>
        <th style="width:15%">Dosage</th>
        <th style="width:15%">Frequency</th>
        <th style="width:15%">Duration</th>
        <th style="width:20%">Instructions</th>
      </tr>
    </thead>
    <tbody>
      @foreach($p->items as $i)
        <tr>
          <td>{{ $i->drug_name_cache }}</td>
          <td>{{ $i->dosage }}</td>
          <td>{{ $i->frequency }}</td>
          <td>{{ $i->duration ?? '—' }}</td>
          <td>{{ $i->instructions ?? '—' }}</td>
        </tr>
      @endforeach
    </tbody>
  </table>

  @if($p->notes)
    <p class="small"><strong>Notes:</strong> {{ $p->notes }}</p>
  @endif

  <p class="small muted">
    Created by: {{ $p->creator->name ?? '—' }} on {{ $p->created_at->format('Y-m-d H:i') }} |
    Last edited by: {{ $p->editor->name ?? '—' }} on {{ $p->updated_at->format('Y-m-d H:i') }}
  </p>
</body>
</html>
