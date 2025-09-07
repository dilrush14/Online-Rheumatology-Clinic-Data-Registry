<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\Admin\UserManagementController;
use App\Http\Controllers\Admin\IcdTermController;
use App\Http\Controllers\Doctor\PatientController;
use App\Http\Controllers\Doctor\VisitController;
use App\Http\Controllers\Doctor\LabOrderController;
use App\Http\Controllers\Doctor\LabResultController;
use App\Http\Controllers\Doctor\CalculatorController;
use App\Http\Controllers\Doctor\PrescriptionController;
use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\DashboardController;


Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin'       => Route::has('login'),
        'canRegister'    => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion'     => PHP_VERSION,
    ]);
});

        // ---------------- Dashboards + GLOBAL quick search ----------------
    Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', fn () => Inertia::render('Dashboard'))->name('dashboard');
    Route::get('/admin/dashboard', fn () => Inertia::render('Admin/Dashboard'))->name('admin.dashboard');
    Route::get('/doctor/dashboard',     [DashboardController::class, 'doctor'])->name('doctor.dashboard');
    Route::get('/nurse/dashboard',      [DashboardController::class, 'nurse'])->name('nurse.dashboard');
    Route::get('/consultant/dashboard', [DashboardController::class, 'consultant'])->name('consultant.dashboard');
    Route::get('/patients/quick-search', [PatientController::class, 'quickSearch'])->name('patients.quick-search');

    });
    
    //-----Analysis group without nurse
    Route::middleware(['auth','verified'])->group(function () {
    
    // Data Analysis
    Route::get('/analytics', [AnalyticsController::class, 'index'])->name('analytics.index');
    
        // NEW: patient search + DAS28 series JSON
        Route::get('/analytics/patient-search', [AnalyticsController::class, 'patientSearch'])->name('analytics.patient_search');
        Route::get('/analytics/patient/{patient}/das28', [AnalyticsController::class, 'patientDas28'])->name('analytics.patient_das28');
        });

        // ------------- Admin -------------
        Route::middleware(['auth'])->prefix('admin')->name('admin.')->
        group(function () {
        Route::resource('users', UserManagementController::class);
        Route::resource('icd-terms', IcdTermController::class)->except(['show']);
        });
        // ------------- Admin Dashbord -------------
        Route::middleware(['auth', 'verified'])->group(function () {
        Route::get('/dashboard', fn () => Inertia::render('Dashboard'))->name('dashboard');
            // ⬇️ use controller instead of closure
        Route::get('/admin/dashboard', [AdminController::class, 'dashboard'])->name('admin.dashboard');
        });

        // ------------- Profile -------------
            Route::middleware('auth')->group(function () {
            Route::get('/profile',  [ProfileController::class, 'edit'])->name('profile.edit');
            Route::patch('/profile',[ProfileController::class, 'update'])->name('profile.update');
            Route::delete('/profile',[ProfileController::class, 'destroy'])->name('profile.destroy');
        });

// ------------- Doctor -------------
    Route::middleware(['auth','verified'])
        ->prefix('doctor')
        ->name('doctor.')
        ->group(function (){

            // Patients
            Route::get('/patients',                [PatientController::class, 'index'])->name('patients.index');
            Route::get('/patients/create',         [PatientController::class, 'create'])->name('patients.create');
            Route::post('/patients',               [PatientController::class, 'store'])->name('patients.store');
            Route::get('/patients/{patient}',      [PatientController::class, 'show'])->name('patients.show');
            Route::get('/patients/{patient}/edit', [PatientController::class, 'edit'])->name('patients.edit');
            Route::put('/patients/{patient}',      [PatientController::class, 'update'])->name('patients.update');
            Route::delete('/patients/{patient}',   [PatientController::class, 'destroy'])->name('patients.destroy');
            Route::get('/patients/{patient}/overview', [PatientController::class, 'overview'])->name('patients.overview');

                // Visits
                Route::get('/patients/{patient}/visits/create', [VisitController::class, 'create'])->name('patients.visits.create');
                Route::post('/patients/{patient}/visits',       [VisitController::class, 'store'])->name('patients.visits.store');

                // ICD terms API
                Route::get('/icd-terms', [IcdTermController::class, 'apiList'])->name('icd.terms');

                // Lab Orders
                Route::get('/patients/{patient}/lab-orders',               [LabOrderController::class, 'index'])->name('patients.lab-orders.index');
                Route::get('/patients/{patient}/lab-orders/create',        [LabOrderController::class, 'create'])->name('patients.lab-orders.create');
                Route::post('/patients/{patient}/lab-orders',              [LabOrderController::class, 'store'])->name('patients.lab-orders.store');
                Route::get('/patients/{patient}/lab-orders/{order}/edit',  [LabOrderController::class, 'edit'])->name('patients.lab-orders.edit');
                Route::put('/patients/{patient}/lab-orders/{order}',       [LabOrderController::class, 'update'])->name('patients.lab-orders.update');
                Route::delete('/patients/{patient}/lab-orders/{order}',    [LabOrderController::class, 'destroy'])->name('patients.lab-orders.destroy');
                Route::put('/patients/{patient}/lab-orders/{order}/cancel', [LabOrderController::class, 'cancel'])->name('patients.lab-orders.cancel');

                // Lab Results
                Route::get('/patients/{patient}/lab-orders/{order}/items/{item}/result',  [LabResultController::class, 'create'])->name('patients.lab-results.create');
                Route::post('/patients/{patient}/lab-orders/{order}/items/{item}/result', [LabResultController::class, 'store'])->name('patients.lab-results.store');
                Route::get('/patients/{patient}/lab-orders/{order}/items/{item}/result/edit', [LabResultController::class, 'edit'])->name('patients.lab-results.edit');
                Route::put('/patients/{patient}/lab-orders/{order}/items/{item}/result',      [LabResultController::class, 'update'])->name('patients.lab-results.update');

                // Calculators
                Route::prefix('patients/{patient}/calculators')->name('patients.calculators.')->group(function () {
                Route::get('/', [CalculatorController::class, 'index'])->name('index');

                // --- DAS28 ---
                Route::get('das28',  [CalculatorController::class, 'das28'])->name('das28');
                Route::post('das28', [CalculatorController::class, 'storeDas28'])->name('das28.store');
                Route::get('das28/{assessment}/edit',[CalculatorController::class, 'editDas28'])->name('das28.edit');
                Route::put('das28/{assessment}',[CalculatorController::class, 'updateDas28'])->name('das28.update');
                Route::delete('das28/{assessment}',[CalculatorController::class, 'destroyDas28'])->name('das28.destroy');

                // --- CDAI ---
                Route::get('cdai',  [CalculatorController::class, 'cdai'])->name('cdai');
                Route::post('cdai', [CalculatorController::class, 'storeCdai'])->name('cdai.store');
                Route::get('cdai/{assessment}/edit',[CalculatorController::class, 'editCdai'])->name('cdai.edit');
                Route::put('cdai/{assessment}',[CalculatorController::class, 'updateCdai'])->name('cdai.update');
                Route::delete('cdai/{assessment}',[CalculatorController::class, 'destroyCdai'])->name('cdai.destroy');
                    

                // --- SDAI ---

                Route::get('/sdai', [CalculatorController::class, 'sdai'])->name('sdai');
                Route::post('/sdai', [CalculatorController::class, 'storeSdai'])->name('sdai.store');
                Route::get('sdai/{assessment}/edit',  [CalculatorController::class, 'editSdai'])->name('sdai.edit');
                Route::put('sdai/{assessment}',        [CalculatorController::class, 'updateSdai'])->name('sdai.update');
                Route::delete('sdai/{assessment}',     [CalculatorController::class, 'destroySdai'])->name('sdai.destroy');

                // BASDAI
                Route::get('basdai',  [CalculatorController::class, 'basdai'])->name('basdai');
                Route::post('basdai', [CalculatorController::class, 'storeBasdai'])->name('basdai.store');
                Route::get('basdai/{assessment}/edit', [CalculatorController::class, 'editBasdai'])->name('basdai.edit');
                Route::put('basdai/{assessment}',      [CalculatorController::class, 'updateBasdai'])->name('basdai.update');
                Route::delete('basdai/{assessment}',   [CalculatorController::class, 'destroyBasdai'])->name('basdai.destroy');

                // ASDAS-CRP
                Route::get('asdas-crp',  [CalculatorController::class, 'asdasCrp'])->name('asdas_crp');
                Route::post('asdas-crp', [CalculatorController::class, 'storeAsdasCrp'])->name('asdas_crp.store');
                Route::get('asdas-crp/{assessment}/edit', [CalculatorController::class, 'editAsdasCrp'])->name('asdas_crp.edit');
                Route::put('asdas-crp/{assessment}',      [CalculatorController::class, 'updateAsdasCrp'])->name('asdas_crp.update');
                Route::delete('asdas-crp/{assessment}',   [CalculatorController::class, 'destroyAsdasCrp'])->name('asdas_crp.destroy');

                // HAQ-DI
                Route::get('haqdi',  [CalculatorController::class, 'haqdi'])->name('haqdi');
                Route::post('haqdi', [CalculatorController::class, 'storeHaqdi'])->name('haqdi.store');
                Route::get('haqdi/{assessment}/edit', [CalculatorController::class, 'editHaqdi'])->name('haqdi.edit');
                Route::put('haqdi/{assessment}',      [CalculatorController::class, 'updateHaqdi'])->name('haqdi.update');
                Route::delete('haqdi/{assessment}',   [CalculatorController::class, 'destroyHaqdi'])->name('haqdi.destroy');

                // DAPSA
                Route::get('dapsa',  [CalculatorController::class, 'dapsa'])->name('dapsa');
                Route::post('dapsa', [CalculatorController::class, 'storeDapsa'])->name('dapsa.store');
                Route::get('dapsa/{assessment}/edit', [CalculatorController::class, 'editDapsa'])->name('dapsa.edit');
                Route::put('dapsa/{assessment}',      [CalculatorController::class, 'updateDapsa'])->name('dapsa.update');
                Route::delete('dapsa/{assessment}',   [CalculatorController::class, 'destroyDapsa'])->name('dapsa.destroy');

                // VAS
                Route::get('vas',  [CalculatorController::class, 'vas'])->name('vas');
                Route::post('vas', [CalculatorController::class, 'storeVas'])->name('vas.store');
                Route::get('vas/{entry}/edit', [CalculatorController::class, 'editVas'])->name('vas.edit');
                Route::put('vas/{entry}',      [CalculatorController::class, 'updateVas'])->name('vas.update');
                Route::delete('vas/{entry}',   [CalculatorController::class, 'destroyVas'])->name('vas.destroy');

                // BMI
                Route::get('bmi',  [CalculatorController::class, 'bmi'])->name('bmi');
                Route::post('bmi', [CalculatorController::class, 'storeBmi'])->name('bmi.store');
                Route::get('bmi/{entry}/edit', [CalculatorController::class, 'editBmi'])->name('bmi.edit');
                Route::put('bmi/{entry}',      [CalculatorController::class, 'updateBmi'])->name('bmi.update');
                Route::delete('bmi/{entry}',   [CalculatorController::class, 'destroyBmi'])->name('bmi.destroy');

                // EULAR
                Route::get('eular-response',  [CalculatorController::class, 'eularResp'])->name('eular_resp');
                Route::post('eular-response', [CalculatorController::class, 'storeEularResp'])->name('eular_resp.store');
                Route::get('eular-response/{response}/edit', [CalculatorController::class, 'editEularResp'])->name('eular_resp.edit');
                Route::put('eular-response/{response}',      [CalculatorController::class, 'updateEularResp'])->name('eular_resp.update');
                Route::delete('eular-response/{response}',   [CalculatorController::class, 'destroyEularResp'])->name('eular_resp.destroy');
                });
                // drug search (note: no extra /doctor here because we're already in the doctor group)
                Route::get('/drugs/search', [PrescriptionController::class,'drugSearch'])->name('drugs.search');

                // patient prescriptions
                Route::prefix('patients/{patient}')->name('patients.')->group(function () {
                Route::get('prescriptions/create', [PrescriptionController::class,'create'])->name('prescriptions.create');
                Route::post('prescriptions', [PrescriptionController::class,'store'])->name('prescriptions.store');
                Route::get('prescriptions/{prescription}/edit', [PrescriptionController::class,'edit'])->name('prescriptions.edit');
                Route::put('prescriptions/{prescription}', [PrescriptionController::class,'update'])->name('prescriptions.update');
                Route::delete('prescriptions/{prescription}', [PrescriptionController::class,'destroy'])->name('prescriptions.destroy');
                Route::get('prescriptions/{prescription}/print', [PrescriptionController::class,'print'])->name('prescriptions.print');
                });
                
                // Print: Patient Overview (PDF)
                Route::get('/patients/{patient}/overview/print', [PatientController::class,'printOverview'])->name('patients.overview.print');
                
        });

require __DIR__.'/auth.php';
