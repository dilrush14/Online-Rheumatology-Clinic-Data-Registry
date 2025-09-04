<?php
// database/migrations/2025_08_29_000102_create_sdai_assessments_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('sdai_assessments', function (Blueprint $t) {
            $t->id();
            $t->foreignId('patient_id')->constrained()->cascadeOnDelete();
            $t->foreignId('doctor_id')->constrained('users')->cascadeOnDelete();
            $t->timestamp('assessed_at')->index();
            $t->unsignedTinyInteger('tjc28')->default(0);
            $t->unsignedTinyInteger('sjc28')->default(0);
            $t->decimal('pt_global',5,2)->default(0);
            $t->decimal('ph_global',5,2)->default(0);
            $t->decimal('crp',6,2)->nullable(); // mg/dL (or mg/L if you prefer)
            $t->decimal('score',6,2)->index();
            $t->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('sdai_assessments'); }
};
