<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('drugs', function (Blueprint $table) {
            $table->id();
            $table->string('name');                // e.g., Methotrexate
            $table->string('form')->nullable();    // tablet, injection
            $table->string('strength')->nullable();// 2.5 mg, 10 mg
            $table->string('code')->nullable();    // optional ATC or hospital code
            $table->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('drugs');
    }
};
