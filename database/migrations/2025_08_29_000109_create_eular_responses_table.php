<?php
// database/migrations/2025_08_29_000109_create_eular_responses_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('eular_responses', function (Blueprint $t) {
            $t->id();
            $t->foreignId('patient_id')->constrained()->cascadeOnDelete();
            $t->foreignId('doctor_id')->constrained('users')->cascadeOnDelete();
            $t->timestamp('assessed_at')->index();
            $t->decimal('baseline_das28',4,2)->nullable();
            $t->decimal('current_das28',4,2)->nullable();
            $t->decimal('delta',4,2)->nullable();
            $t->string('response', 20)->nullable(); // Good/Moderate/None
            $t->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('eular_responses'); }
};
