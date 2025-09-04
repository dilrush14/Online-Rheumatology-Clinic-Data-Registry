<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('cdai_assessments', function (Blueprint $table) {
            if (!Schema::hasColumn('cdai_assessments', 'ptg')) {
                $table->decimal('ptg', 4, 1)->default(0)->after('sjc28');
            }
            if (!Schema::hasColumn('cdai_assessments', 'phg')) {
                $table->decimal('phg', 4, 1)->default(0)->after('ptg');
            }
            if (!Schema::hasColumn('cdai_assessments', 'score')) {
                $table->decimal('score', 5, 1)->default(0)->after('phg');
            }
            if (!Schema::hasColumn('cdai_assessments', 'category')) {
                $table->string('category', 20)->after('score');
            }
            if (!Schema::hasColumn('cdai_assessments', 'tender_joints')) {
                $table->json('tender_joints')->nullable()->after('category');
            }
            if (!Schema::hasColumn('cdai_assessments', 'swollen_joints')) {
                $table->json('swollen_joints')->nullable()->after('tender_joints');
            }
        });
    }

    public function down(): void
    {
        Schema::table('cdai_assessments', function (Blueprint $table) {
            if (Schema::hasColumn('cdai_assessments', 'swollen_joints')) {
                $table->dropColumn('swollen_joints');
            }
            if (Schema::hasColumn('cdai_assessments', 'tender_joints')) {
                $table->dropColumn('tender_joints');
            }
            if (Schema::hasColumn('cdai_assessments', 'category')) {
                $table->dropColumn('category');
            }
            if (Schema::hasColumn('cdai_assessments', 'score')) {
                $table->dropColumn('score');
            }
            if (Schema::hasColumn('cdai_assessments', 'phg')) {
                $table->dropColumn('phg');
            }
            if (Schema::hasColumn('cdai_assessments', 'ptg')) {
                $table->dropColumn('ptg');
            }
        });
    }
};
