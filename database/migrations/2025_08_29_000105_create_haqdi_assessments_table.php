<?php
// database/migrations/2025_08_29_000105_create_haqdi_assessments_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('haqdi_assessments', function (Blueprint $t) {
            $t->id();
            $t->foreignId('patient_id')->constrained()->cascadeOnDelete();
            $t->foreignId('doctor_id')->constrained('users')->cascadeOnDelete();
            $t->timestamp('assessed_at')->index();
            $t->json('items'); // array of numbers
            $t->decimal('score',4,2)->index();
            $t->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('haqdi_assessments'); }
};
