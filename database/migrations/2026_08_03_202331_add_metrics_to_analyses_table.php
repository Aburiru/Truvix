<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('analyses', function (Blueprint $table) {
            $table->float('perplexity_score')->nullable()->after('analysis_summary');
            $table->float('burstiness_score')->nullable()->after('perplexity_score');
            $table->integer('sentence_count')->nullable()->after('burstiness_score');
            $table->float('average_sentence_length')->nullable()->after('sentence_count');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('analyses', function (Blueprint $table) {
            $table->dropColumn('perplexity_score');
            $table->dropColumn('burstiness_score');
            $table->dropColumn('sentence_count');
            $table->dropColumn('average_sentence_length');
        });
    }
};