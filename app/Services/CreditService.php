<?php

namespace App\Services;

use App\Models\User;
use App\Models\CreditTransaction;

class CreditService
{
    public function addCredits(User $user, int $amount, string $description = 'Credit purchase')
    {
        $user->credits += $amount;
        $user->save();

        CreditTransaction::create([
            'user_id' => $user->id,
            'amount' => $amount,
            'type' => 'purchase',
            'description' => $description,
        ]);
    }
}
