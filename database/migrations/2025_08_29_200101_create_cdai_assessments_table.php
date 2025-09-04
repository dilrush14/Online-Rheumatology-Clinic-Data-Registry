<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('cdai_assessments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_id')->constrained()->cascadeOnDelete();
            $table->foreignId('doctor_id')->constrained('users')->cascadeOnDelete();

            $table->timestamp('assessed_at');

            $table->unsignedTinyInteger('tjc28')->default(0); // 0-28
            $table->unsignedTinyInteger('sjc28')->default(0); // 0-28
            $table->decimal('ptg', 4, 1)->default(0); // 0-10 (one decimal)
            $table->decimal('phg', 4, 1)->default(0); // 0-10 (one decimal)
            $table->decimal('score', 5, 1)->default(0);       // up to ~76.0

            $table->string('category', 20);

            $table->json('tender_joints')->nullable();
            $table->json('swollen_joints')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cdai_assessments');
    }
};
