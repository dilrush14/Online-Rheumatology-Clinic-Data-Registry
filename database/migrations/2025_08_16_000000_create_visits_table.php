<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('visits', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_id')->constrained()->cascadeOnDelete();
            $table->date('visit_date');
            $table->text('chief_complaint');
            $table->longText('history')->nullable();
            $table->json('vitals')->nullable(); // {height_cm, weight_kg, bp, pulse_bpm, temp_c}
            $table->text('provisional_diagnosis')->nullable();
            $table->longText('plan')->nullable();
            $table->longText('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('visits');
    }
};
