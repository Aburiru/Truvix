<?php

use App\Http\Controllers\AnalysisController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/analyze/text', [AnalysisController::class, 'analyzeText']);
    Route::post('/analyze/image', [AnalysisController::class, 'analyzeImage']);
    Route::get('/analyses', [AnalysisController::class, 'getAnalyses']);
});
