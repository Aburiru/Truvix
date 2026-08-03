<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class DetectionFactory extends Factory
{
    public function definition(): array
    {
        return [
            'type' => 'image',
            'input_content' => 'test.jpg',
            'ai_probability' => 0.9,
            'human_probability' => 0.1,
            'confidence_score' => 'high',
            'analysis_summary' => 'AI Generated',
        ];
    }
}
