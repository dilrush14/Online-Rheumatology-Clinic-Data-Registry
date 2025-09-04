<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('lab_orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_id')->constrained()->cascadeOnDelete();
            $table->foreignId('ordered_by_user_id')->constrained('users'); // doctor
            $table->foreignId('visit_id')->nullable()->constrained()->nullOnDelete();
            $table->timestamp('ordered_at')->useCurrent();
            $table->enum('status', ['pending','partially_reported','completed','cancelled'])->default('pending');
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('lab_orders');
    }
};
