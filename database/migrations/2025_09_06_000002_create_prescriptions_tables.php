<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('prescriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_id')->constrained()->cascadeOnDelete();
            $table->date('prescribed_date')->nullable();
            $table->string('diagnosis')->nullable(); // free text or ICD title
            $table->string('diagnosis_code')->nullable(); // optional ICD code
            $table->text('notes')->nullable();
            // audit
            $table->foreignId('created_by')->constrained('users');
            $table->foreignId('updated_by')->nullable()->constrained('users');
            $table->timestamps();
        });

        Schema::create('prescription_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('prescription_id')->constrained()->cascadeOnDelete();
            $table->foreignId('drug_id')->constrained('drugs');
            $table->string('drug_name_cache'); // snapshot of name+strength
            $table->string('frequency');       // e.g., bd, tds, once weekly
            $table->string('dosage');          // e.g., 10 mg, 2 tablets
            $table->string('duration')->nullable(); // e.g., 2 weeks, 3 months
            $table->string('route')->nullable();    // po, sc, im
            $table->text('instructions')->nullable();
            $table->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('prescription_items');
        Schema::dropIfExists('prescriptions');
    }
};
