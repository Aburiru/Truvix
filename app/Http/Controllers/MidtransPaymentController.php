<?php

namespace App\Http\Controllers;

use App\Services\CreditService;
use App\Models\User;
use App\Models\Order;
use Illuminate\Http\Request;
use Midtrans\Snap;
use Midtrans\Notification;

class MidtransPaymentController extends Controller
{
    protected $creditService;

    public function __construct(CreditService $creditService)
    {
        $this->creditService = $creditService;
    }

    public function requestPayment(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric',
            'order_id' => 'required|string',
            'plan_key' => 'nullable|string',
        ]);

        $user = $request->user();

        // Create an order record in your database
        $order = Order::create([
            'user_id' => $user->id,
            'order_id' => $request->order_id,
            'gross_amount' => $request->amount,
            'status' => 'pending',
            'plan_key' => $request->plan_key,
        ]);

        $params = [
            'transaction_details' => [
                'order_id' => $order->order_id,
                'gross_amount' => $order->gross_amount,
            ],
            'customer_details' => [
                'first_name' => $user->name,
                'email' => $user->email,
            ],
        ];

        try {
            $snapToken = Snap::getSnapToken($params);
            return response()->json(['token' => $snapToken]);
        } catch (\Exception $e) {
            $order->status = 'failed';
            $order->save();
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function handleNotification(Request $request)
    {
        $notif = new Notification();

        $transactionStatus = $notif->transaction_status;
        $type = $notif->payment_type;
        $orderId = $notif->order_id;
        $fraudStatus = $notif->fraud_status;

        \Log::info('Midtrans Notification Received:', (array) $notif);

        $order = Order::where('order_id', $orderId)->first();

        if (!$order) {
            \Log::error("Order with ID {$orderId} not found.");
            return response()->json(['message' => 'Order not found'], 404);
        }

        if ($transactionStatus == 'capture') {
            if ($type == 'credit_card') {
                if ($fraudStatus == 'challenge') {
                    $order->status = 'challenge';
                } else if ($fraudStatus == 'accept') {
                    $order->status = 'success';
                    $this->creditService->addCredits(
                        $order->user,
                        $order->gross_amount, // Assuming gross_amount directly maps to credits
                        "Midtrans Payment for Order ID: {$orderId} (Plan: {$order->plan_key})"
                    );
                }
            }
        } else if ($transactionStatus == 'settlement') {
            $order->status = 'success';
            $this->creditService->addCredits(
                $order->user,
                $order->gross_amount, // Assuming gross_amount directly maps to credits
                "Midtrans Payment for Order ID: {$orderId} (Plan: {$order->plan_key})"
            );
        } else if ($transactionStatus == 'pending') {
            $order->status = 'pending';
        } else if ($transactionStatus == 'deny') {
            $order->status = 'failed';
        } else if ($transactionStatus == 'expire') {
            $order->status = 'expired';
        } else if ($transactionStatus == 'cancel') {
            $order->status = 'cancelled';
        }

        $order->save();

        return response()->json(['message' => 'Notification handled', 'order_id' => $orderId]);
    }
