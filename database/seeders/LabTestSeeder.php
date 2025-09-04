<?php

namespace Database\Seeders;

use App\Models\LabTest;
use Illuminate\Database\Seeder;

class LabTestSeeder extends Seeder
{
    public function run(): void
    {
        $tests = [
            ['code'=>'FBS','name'=>'Fasting Blood Sugar','specimen_type'=>'Serum','units'=>'mg/dL','reference_ranges'=>['adult'=>['low'=>70,'high'=>99]]],
            ['code'=>'FBC','name'=>'Full Blood Count','specimen_type'=>'Whole Blood','units'=>null,'reference_ranges'=>null],
            ['code'=>'ESR','name'=>'Erythrocyte Sedimentation Rate','specimen_type'=>'Whole Blood','units'=>'mm/hr','reference_ranges'=>['male'=>['low'=>0,'high'=>15],'female'=>['low'=>0,'high'=>20]]],
            ['code'=>'CRP','name'=>'C-Reactive Protein','specimen_type'=>'Serum','units'=>'mg/L','reference_ranges'=>['adult'=>['low'=>0,'high'=>5]]],
        ];

        foreach ($tests as $t) {
            LabTest::updateOrCreate(['code'=>$t['code']], $t);
        }
    }
}
