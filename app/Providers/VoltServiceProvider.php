<?php

namespace App\Providers;

use Livewire\Volt\Volt;
use Illuminate\Support\ServiceProvider;

class VoltServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        Volt::registerPaths(
            base_path('resources/views/pages')
        );
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}