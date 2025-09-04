<?php
// database/migrations/2025_08_29_000104_create_asdas_crp_assessments_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('asdas_crp_assessments', function (Blueprint $t) {
            $t->id();
            $t->foreignId('patient_id')->constrained()->cascadeOnDelete();
            $t->foreignId('doctor_id')->constrained('users')->cascadeOnDelete();
            $t->timestamp('assessed_at')->index();
            $t->decimal('back_pain',5,2)->default(0);
            $t->decimal('morning_stiffness_duration',5,2)->default(0);
            $t->decimal('peripheral_pain_swelling',5,2)->default(0);
            $t->decimal('pt_global',5,2)->default(0);
            $t->decimal('crp',6,2)->nullable(); // mg/L
            $t->decimal('score',6,2)->index();
            $t->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('asdas_crp_assessments'); }
};
