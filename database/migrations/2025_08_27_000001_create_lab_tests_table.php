<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('lab_tests', function (Blueprint $table) {
            $table->id();
            $table->string('code', 32)->unique();     // e.g. FBS, FBC, ESR, CRP
            $table->string('name');                   // e.g. Fasting Blood Sugar
            $table->string('specimen_type')->nullable(); // e.g. Serum, Whole Blood
            $table->string('units')->nullable();      // e.g. mg/dL, mm/hr
            $table->json('reference_ranges')->nullable(); // JSON for male/female/age
            $table->boolean('active')->default(true);
            $table->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('lab_tests');
    }
};
