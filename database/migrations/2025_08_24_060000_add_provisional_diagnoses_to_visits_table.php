<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('visits', function (Blueprint $table) {
            if (!Schema::hasColumn('visits', 'provisional_diagnoses')) {
                $table->json('provisional_diagnoses')->nullable()->after('vitals');
            }
        });
    }

    public function down(): void
    {
        Schema::table('visits', function (Blueprint $table) {
            if (Schema::hasColumn('visits', 'provisional_diagnoses')) {
                $table->dropColumn('provisional_diagnoses');
            }
        });
    }
};
