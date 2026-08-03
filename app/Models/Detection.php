<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class Detection extends Model
{
    use HasFactory, HasApiTokens;

    protected $table = 'detections';

    protected $fillable = [
        'user_id',
        'type',
        'input_content',
        'ai_probability',
        'human_probability',
        'confidence_score',
        'analysis_summary',
    ];
}
