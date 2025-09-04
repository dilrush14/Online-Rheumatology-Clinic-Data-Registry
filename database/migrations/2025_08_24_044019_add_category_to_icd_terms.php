<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('icd_terms', function (Blueprint $table) {
            $table->string('category', 20)->default('complaint')->after('title'); // complaint|diagnosis|both
            $table->index(['category', 'is_active']);
        });
    }
    public function down(): void
    {
        Schema::table('icd_terms', function (Blueprint $table) {
            $table->dropIndex(['category', 'is_active']);
            $table->dropColumn('category');
        });
    }
};
