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
    Route::get('/doctor/dashboard', fn () => Inertia::render('Doctor/Dashboard'))->name('doctor.dashboard');
    Route::get('/nurse/dashboard', fn () => Inertia::render('Nurse/Dashboard'))->name('nurse.dashboard');
    Route::get('/consultant/dashboard', fn () => Inertia::render('Consultant/Dashboard'))->name('consultant.dashboard');

    Route::get('/patients/quick-search', [PatientController::class, 'quickSearch'])
        ->name('patients.quick-search');
});

// ------------- Admin -------------
Route::middleware(['auth'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::resource('users', UserManagementController::class);
        Route::resource('icd-terms', IcdTermController::class)->except(['show']);
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
    ->group(function () {

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

            Route::get('/das28', [CalculatorController::class, 'das28'])->name('das28');
            Route::post('/das28', [CalculatorController::class, 'storeDas28'])->name('das28.store');

            Route::get('/cdai', [CalculatorController::class, 'cdai'])->name('cdai');
            Route::post('/cdai', [CalculatorController::class, 'storeCdai'])->name('cdai.store');

            Route::get('/sdai', [CalculatorController::class, 'sdai'])->name('sdai');
            Route::post('/sdai', [CalculatorController::class, 'storeSdai'])->name('sdai.store');

            Route::get('/basdai', [CalculatorController::class, 'basdai'])->name('basdai');
            Route::post('/basdai', [CalculatorController::class, 'storeBasdai'])->name('basdai.store');

            Route::get('/asdas-crp', [CalculatorController::class, 'asdasCrp'])->name('asdas_crp');
            Route::post('/asdas-crp', [CalculatorController::class, 'storeAsdasCrp'])->name('asdas_crp.store');

            Route::get('/haqdi', [CalculatorController::class, 'haqdi'])->name('haqdi');
            Route::post('/haqdi', [CalculatorController::class, 'storeHaqdi'])->name('haqdi.store');

            Route::get('/dapsa', [CalculatorController::class, 'dapsa'])->name('dapsa');
            Route::post('/dapsa', [CalculatorController::class, 'storeDapsa'])->name('dapsa.store');

            Route::get('/vas', [CalculatorController::class, 'vas'])->name('vas');
            Route::post('/vas', [CalculatorController::class, 'storeVas'])->name('vas.store');

            Route::get('/bmi', [CalculatorController::class, 'bmi'])->name('bmi');
            Route::post('/bmi', [CalculatorController::class, 'storeBmi'])->name('bmi.store');

            Route::get('/eular-response', [CalculatorController::class, 'eularResp'])->name('eular_resp');
            Route::post('/eular-response', [CalculatorController::class, 'storeEularResp'])->name('eular_resp.store');
        
            });
    });

require __DIR__.'/auth.php';
