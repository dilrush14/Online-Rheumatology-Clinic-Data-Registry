<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        // Avoid requiring doctrine/dbal by using raw SQL
        DB::statement('ALTER TABLE visits DROP COLUMN chief_complaint');
    }

    public function down(): void
    {
        // If you ever rollback, we’ll re-add it as nullable (safe default)
        DB::statement('ALTER TABLE visits ADD chief_complaint TEXT NULL');
    }
};
