<?php

use Illuminate\Support\Facades\Route;

// Include API routes
require __DIR__.'/api.php';

Route::get('/', function () {
    return view('welcome');
});
