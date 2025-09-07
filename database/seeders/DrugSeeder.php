<?php
namespace Database\Seeders;

use App\Models\Drug;
use Illuminate\Database\Seeder;

class DrugSeeder extends Seeder {
    public function run(): void {
        $list = [
            ['name'=>'Methotrexate','form'=>'tablet','strength'=>'2.5 mg'],
            ['name'=>'Sulfasalazine','form'=>'tablet','strength'=>'500 mg'],
            ['name'=>'Hydroxychloroquine','form'=>'tablet','strength'=>'200 mg'],
            ['name'=>'Prednisolone','form'=>'tablet','strength'=>'5 mg'],
            ['name'=>'Folic Acid','form'=>'tablet','strength'=>'5 mg'],
        ];
        foreach ($list as $d) Drug::firstOrCreate($d);
    }
}
