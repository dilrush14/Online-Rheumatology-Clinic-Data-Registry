<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('haqdi_assessments', function (Blueprint $table) {
            // If the column already exists and is NOT NULL:
            $table->json('items')->nullable()->change();  // allow nulls
            // Or, if you prefer a default empty array:
            // $table->json('items')->default(json_encode([]))->change();
        });
    }

    public function down(): void
    {
        Schema::table('haqdi_assessments', function (Blueprint $table) {
            // Revert as needed for your schema
            $table->json('items')->nullable(false)->change();
        });
    }
};
