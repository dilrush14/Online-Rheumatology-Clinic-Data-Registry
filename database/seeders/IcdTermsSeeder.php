<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\IcdTerm;

class IcdTermsSeeder extends Seeder
{
    public function run(): void
    {
        $rows = [
            // --- Complaints (symptoms) ---
            ['code' => 'R07.4', 'title' => 'Chest pain, unspecified', 'category' => 'complaint'],
            ['code' => 'R52',   'title' => 'Pain, unspecified',        'category' => 'complaint'],
            ['code' => 'R53',   'title' => 'Malaise and fatigue',      'category' => 'complaint'],
            ['code' => 'R50.9', 'title' => 'Fever, unspecified',       'category' => 'complaint'],
            ['code' => 'M25.5', 'title' => 'Pain in joint',            'category' => 'complaint'],
            ['code' => 'M79.1', 'title' => 'Myalgia',                  'category' => 'complaint'],
            ['code' => 'R29.898','title'=> 'Morning stiffness',        'category' => 'complaint'],
            ['code' => 'R60.9', 'title' => 'Edema, unspecified',       'category' => 'complaint'],
            ['code' => 'R21',   'title' => 'Rash and other skin eruption','category'=>'complaint'],
            ['code' => 'R68.84','title' => 'Jaw pain',                 'category' => 'complaint'],

            // --- Diagnoses (common rheumatology) ---
            ['code' => 'M05.9', 'title' => 'Rheumatoid arthritis with rheumatoid factor, unspecified', 'category' => 'diagnosis'],
            ['code' => 'M06.9', 'title' => 'Rheumatoid arthritis, unspecified',                         'category' => 'diagnosis'],
            ['code' => 'M15.9', 'title' => 'Polyosteoarthritis, unspecified',                           'category' => 'diagnosis'],
            ['code' => 'M16.9', 'title' => 'Osteoarthritis of hip, unspecified',                        'category' => 'diagnosis'],
            ['code' => 'M17.9', 'title' => 'Osteoarthritis of knee, unspecified',                       'category' => 'diagnosis'],
            ['code' => 'M45',   'title' => 'Ankylosing spondylitis',                                     'category' => 'diagnosis'],
            ['code' => 'M46.1', 'title' => 'Sacroiliitis, not elsewhere classified',                     'category' => 'diagnosis'],
            ['code' => 'M47.819','title'=> 'Spondylosis, unspecified site',                              'category' => 'diagnosis'],
            ['code' => 'M32.9', 'title' => 'Systemic lupus erythematosus, unspecified',                  'category' => 'diagnosis'],
            ['code' => 'M35.3', 'title' => 'Polymyalgia rheumatica',                                     'category' => 'diagnosis'],
            ['code' => 'M31.3', 'title' => 'Wegener granulomatosis (granulomatosis with polyangiitis)',  'category' => 'diagnosis'],
            ['code' => 'M30.0', 'title' => 'Polyarteritis nodosa',                                       'category' => 'diagnosis'],
            ['code' => 'M33.9', 'title' => 'Dermatopolymyositis, unspecified',                           'category' => 'diagnosis'],
            ['code' => 'L40.5', 'title' => 'Arthropathic psoriasis',                                     'category' => 'diagnosis'],
            ['code' => 'M10.9', 'title' => 'Gout, unspecified',                                          'category' => 'diagnosis'],
            ['code' => 'M35.0', 'title' => 'Sjögren syndrome',                                           'category' => 'diagnosis'],
            ['code' => 'M34.9', 'title' => 'Systemic sclerosis, unspecified',                            'category' => 'diagnosis'],
            ['code' => 'M48.06','title' => 'Spinal stenosis, lumbar region',                             'category' => 'diagnosis'],
            ['code' => 'M25.4', 'title' => 'Effusion of joint',                                          'category' => 'diagnosis'],
            ['code' => 'M79.7', 'title' => 'Fibromyalgia',                                               'category' => 'diagnosis'],
        ];

        // Upsert by unique code so you can re-run safely
        foreach ($rows as $r) {
            IcdTerm::updateOrCreate(
                ['code' => $r['code']],
                ['title' => $r['title'], 'category' => $r['category'], 'is_active' => true]
            );
        }
    }
}
