<?php
// database/migrations/2025_08_29_000108_create_bmi_entries_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('bmi_entries', function (Blueprint $t) {
            $t->id();
            $t->foreignId('patient_id')->constrained()->cascadeOnDelete();
            $t->foreignId('doctor_id')->constrained('users')->cascadeOnDelete();
            $t->timestamp('assessed_at')->index();
            $t->decimal('weight_kg',6,2)->nullable();
            $t->decimal('height_m',4,3)->nullable();
            $t->decimal('bmi',4,1)->nullable()->index();
            $t->string('band', 30)->nullable();
            $t->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('bmi_entries'); }
};
