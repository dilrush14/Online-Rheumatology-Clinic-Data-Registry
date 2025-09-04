<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('patients', function (Blueprint $table) {
            $table->id();

            // Identification
            $table->string('national_id', 20)->unique(); // e.g., NIC (old/new formats)
            $table->string('title', 20)->nullable();     // Mr/Ms/Mrs/Dr/Prof, etc.
            $table->string('name');                      // Full name
            $table->string('other_names')->nullable();   // Initials / other names

            // Demographics
            $table->enum('gender', ['M', 'F', 'Other']);
            $table->string('civil_status', 30)->nullable();     // Single/Married/Divorced/Widowed
            $table->string('marital_status', 30)->nullable();   // If you track separately
            $table->string('ethnicity', 60)->nullable();
            $table->enum('blood_group', [
                'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'
            ])->nullable();

            // DOB / Age
            $table->date('dob')->nullable();             // Prefer DOB
            $table->unsignedSmallInteger('age')->nullable(); // Fallback if DOB unknown

            // Contact & Address
            $table->string('phone', 30)->nullable();
            $table->string('email')->nullable();         // not unique (families may share)
            $table->string('address_line1')->nullable();
            $table->string('address_line2')->nullable();
            $table->string('village')->nullable();
            $table->string('district')->nullable();
            $table->string('province')->nullable();      // optional but useful

            // Guardian / Emergency
            $table->string('guardian_name')->nullable();
            $table->string('guardian_relationship', 50)->nullable();
            $table->string('emergency_contact_name')->nullable();
            $table->string('emergency_contact_phone', 30)->nullable();

            // Social / Admin
            $table->string('religion', 60)->nullable();
            $table->string('occupation', 120)->nullable();
            $table->string('health_scheme', 120)->nullable(); // Samurdhi/private/etc.

            // Clinical
            $table->text('chronic_conditions')->nullable(); // free text or JSON later
            $table->text('disability_status')->nullable();
            $table->text('allergies')->nullable();

            // Media
            $table->string('photo_path')->nullable(); // store path in storage/app/public

            // Notes
            $table->text('remarks')->nullable();

          
            // You can rely on created_at, but if you want an explicit column: Registered date
            

            $table->timestamps();        // created_at / updated_at
            $table->softDeletes();       // deleted_at for safe archival

            // Helpful indexes for faster searches
            $table->index(['name']);
            $table->index(['district', 'province']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('patients');
    }
};
