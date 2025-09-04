<?php

namespace App\Http\Controllers\Doctor;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class DoctorManagementController extends Controller
{
    // List all patients (Index view)
    public function index(): Response
    {
        return Inertia::render('Doctor/Patient/Index');   
    }

    // Show patient registry page (optional separate view)
  /*  public function showRegistry(): Response
    {
        return Inertia::render('Doctor/Patient/PatientRegistry');
    }*/
}
