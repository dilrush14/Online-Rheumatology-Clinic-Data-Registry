<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('das28_assessments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_id')->constrained()->cascadeOnDelete();
            $table->foreignId('doctor_id')->constrained('users')->cascadeOnDelete();
            $table->enum('variant', ['ESR','CRP']);
            $table->decimal('esr', 6, 2)->nullable(); // mm/hr
            $table->decimal('crp', 6, 2)->nullable(); // mg/L
            $table->decimal('gh', 6, 2)->nullable();  // Patient Global Health (0–100 mm VAS)
            $table->unsignedTinyInteger('sjc28')->default(0);
            $table->unsignedTinyInteger('tjc28')->default(0);
            $table->decimal('score', 4, 2);
            $table->string('category', 16);
            $table->json('swollen_joints')->nullable();
            $table->json('tender_joints')->nullable();
            $table->timestamp('assessed_at')->useCurrent();
            $table->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('das28_assessments');
    }
};
