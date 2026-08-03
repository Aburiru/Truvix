<?php

use App\Http\Controllers\AnalysisController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DetectionController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/test', function () { return response()->json(['status' => 'ok']); });
    Route::post('/logout', [AuthController::class, 'logout']);

    // Text analysis (existing)
    Route::post('/analyze/text', [AnalysisController::class, 'analyzeText']);

    // PRD STEP 2: Upload image → returns {uploaded, filename}
    Route::post('/detect/image', [DetectionController::class, 'upload']);

    // PRD STEP 5: Process stored image through AI service → returns detection result
    Route::post('/detect/image/process', [DetectionController::class, 'detect']);

    // PRD STEP 10: History
    Route::get('/history', [DetectionController::class, 'history']);
});
