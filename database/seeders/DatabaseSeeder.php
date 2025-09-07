<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;


class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Example: Create a test admin user
        $admin = User::firstOrCreate(
        ['email' => 'admin@example.com'],
        [
            'name' => 'Admin',
            'password' => bcrypt('password'),
            'role' => 'admin',
        ]);

        if (! $admin->hasVerifiedEmail()) {
            $admin->markEmailAsVerified();
        }

        // Example: Create a test doctor user
        $doctor = User::firstOrCreate(
            ['email' => 'doctor@test.com'],
            [
                'name' => 'Dr.Mallawarachchi',
                'password' => bcrypt('password'),
                'role' => 'doctor',
            ]);

        if (! $doctor->hasVerifiedEmail()) {
            $doctor->markEmailAsVerified();
        }

        // Example: Create a test doctor2 user
        $doctor = User::firstOrCreate(
            ['email' => 'doctor2@test.com'],
            [
                'name' => 'Dr.Dissanayaka',
                'password' => bcrypt('password'),
                'role' => 'doctor',
            ]);

        if (! $doctor->hasVerifiedEmail()) {
            $doctor->markEmailAsVerified();
        }

        // Example: Create a test Nurse user
        $nurse = User::firstOrCreate(
        ['email' => 'nurse@test.com'],
        [
            'name' => 'Nurse',
            'password' => bcrypt('password'),
            'role' => 'nurse',
        ]);

        if (! $nurse->hasVerifiedEmail()) {
            $nurse->markEmailAsVerified();
        }

        // Example: Create a test Consultant user
        $consultant = User::firstOrCreate(
        ['email' => 'consultant@test.com'],
        [
            'name' => 'Consultant',
            'password' => bcrypt('password'),
            'role' => 'consultant',
        ]);

        if (! $consultant->hasVerifiedEmail()) {
            $consultant->markEmailAsVerified();
        }
        // Repeat for admin, nurse, or others if needed

  $this->call(IcdTermsSeeder::class);
   $this->call(DrugSeeder::class);

    }
}
