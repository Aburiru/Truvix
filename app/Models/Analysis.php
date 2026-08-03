<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Analysis extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'type',
        'input_content',
        'ai_probability',
        'human_probability',
        'confidence_score',
        'analysis_summary',
        'perplexity_score',
        'burstiness_score',
        'sentence_count',
        'average_sentence_length',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
