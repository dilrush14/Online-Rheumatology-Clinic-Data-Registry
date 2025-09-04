<?php
// database/migrations/2025_08_29_000107_create_vas_entries_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('vas_entries', function (Blueprint $t) {
            $t->id();
            $t->foreignId('patient_id')->constrained()->cascadeOnDelete();
            $t->foreignId('doctor_id')->constrained('users')->cascadeOnDelete();
            $t->timestamp('assessed_at')->index();
            $t->string('label', 100);
            $t->unsignedSmallInteger('value'); // 0–100
            $t->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('vas_entries'); }
};
