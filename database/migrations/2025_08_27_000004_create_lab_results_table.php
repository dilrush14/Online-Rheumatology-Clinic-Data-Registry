<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('lab_results', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lab_order_item_id')->constrained()->cascadeOnDelete();
            $table->foreignId('entered_by_user_id')->constrained('users'); // doctor or nurse
            $table->foreignId('verified_by_user_id')->nullable()->constrained('users');
            // Simple tests can use value/unit; complex tests can use result_json.
            $table->decimal('result_value', 10, 2)->nullable(); // e.g. 92.00
            $table->string('unit', 32)->nullable();             // e.g. mg/dL
            $table->json('result_json')->nullable();            // e.g. FBC panel values
            $table->string('flag', 8)->nullable();              // H/L/N/A
            $table->timestamp('collected_at')->nullable();
            $table->timestamp('result_at')->useCurrent();
            $table->text('comments')->nullable();
            $table->timestamps();

            $table->unique('lab_order_item_id'); // 1 result per item; edit overwrites
        });
    }
    public function down(): void {
        Schema::dropIfExists('lab_results');
    }
};
