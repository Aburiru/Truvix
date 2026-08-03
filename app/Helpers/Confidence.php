<?php

namespace App\Helpers;

class Confidence
{
    /**
     * Map probability (0-1) to confidence label.
     * High >= 0.9, Medium 0.7‑0.89, Low < 0.7.
     */
    public static function map(float $probability): string
    {
        if ($probability >= 0.9) {
            return 'high';
        }
        if ($probability >= 0.7) {
            return 'medium';
        }
        return 'low';
    }
}
?>