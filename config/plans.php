<?php

return [
    'free' => [
        'name' => 'Free Plan',
        'description' => 'Limited detections for testing.',
        'price' => 0,
        'credits' => 10, // Example: 10 free credits
        'recurring' => false,
    ],
    'basic' => [
        'name' => 'Basic Plan',
        'description' => 'For individual users.',
        'price' => 50000, // IDR 50,000
        'credits' => 500,
        'recurring' => true,
    ],
    'pro' => [
        'name' => 'Pro Plan',
        'description' => 'For power users and small teams.',
        'price' => 150000, // IDR 150,000
        'credits' => 2000,
        'recurring' => true,
    ],
];
