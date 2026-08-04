<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;
use App\Models\CreditTransaction;

class CheckCredits
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = Auth::user();

        if (!$user || $user->credits < 1) {
            return response()->json(['message' => 'Insufficient credits'], 403);
        }

        $response = $next($request);

        if ($response->getStatusCode() === 200) {
            $user->credits -= 1;
            $user->save();

            CreditTransaction::create([
                'user_id' => $user->id,
                'amount' => -1,
                'type' => 'deduction',
                'description' => 'AI Detection Service Usage',
            ]);
        }

        return $response;
    }
}

