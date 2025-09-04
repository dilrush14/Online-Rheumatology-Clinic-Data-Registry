<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('lab_order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lab_order_id')->constrained()->cascadeOnDelete();
            $table->foreignId('lab_test_id')->constrained()->cascadeOnDelete();
            $table->enum('status', ['ordered','result_entered','cancelled'])->default('ordered');
            $table->date('due_date')->nullable();
            $table->timestamps();

            $table->unique(['lab_order_id','lab_test_id']); // avoid duplicate same-test in one order
        });
    }
    public function down(): void {
        Schema::dropIfExists('lab_order_items');
    }
};
