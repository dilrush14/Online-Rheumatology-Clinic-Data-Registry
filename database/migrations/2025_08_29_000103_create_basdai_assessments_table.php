<?php
// database/migrations/2025_08_29_000103_create_basdai_assessments_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('basdai_assessments', function (Blueprint $t) {
            $t->id();
            $t->foreignId('patient_id')->constrained()->cascadeOnDelete();
            $t->foreignId('doctor_id')->constrained('users')->cascadeOnDelete();
            $t->timestamp('assessed_at')->index();
            $t->decimal('q1',5,2)->default(0);
            $t->decimal('q2',5,2)->default(0);
            $t->decimal('q3',5,2)->default(0);
            $t->decimal('q4',5,2)->default(0);
            $t->decimal('q5',5,2)->default(0);
            $t->decimal('q6',5,2)->default(0);
            $t->decimal('score',6,2)->index();
            $t->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('basdai_assessments'); }
};
