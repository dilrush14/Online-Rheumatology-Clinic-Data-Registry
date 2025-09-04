<?php

namespace App\Enums;

enum UserRole: string
{
    case ADMIN = 'admin';
    case DOCTOR = 'doctor';
    case NURSE = 'nurse';
    case CONSULTANT = 'consultant';

    public function label(): string
    {
        return match($this) {
            self::ADMIN => 'Admin',
            self::DOCTOR => 'Doctor',
            self::NURSE => 'Nurse',
            self::CONSULTANT => 'Consultant',
        };
    }

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'role' => UserRole::class,
        ];
    }
}