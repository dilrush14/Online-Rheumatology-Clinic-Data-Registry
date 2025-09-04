<?php

namespace App\Http\Controllers\Doctor;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class NurseManagementController extends Controller
{
    // List all patients (Index view)
    public function index(): Response
    {
        return Inertia::render('Nurse/Index');   
    }

    
}
