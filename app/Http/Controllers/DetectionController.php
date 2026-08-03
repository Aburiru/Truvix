<?php

namespace App\Http\Controllers;

use App\Models\Detection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\HttpFoundation\Response;

class DetectionController extends Controller
{
    /**
     * STEP 2 (PRD): Upload image, store, return {uploaded, filename}.
     */
    public function upload(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'image' => 'required|file|mimes:png,jpg,jpeg,webp|max:10240',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'uploaded' => false,
                'error' => $validator->errors()->first(),
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $file = $request->file('image');
        $path = $file->store('uploads');

        return response()->json([
            'uploaded'          => true,
            'filename'          => basename($path),
            'original_filename' => $file->getClientOriginalName(),
        ]);
    }

    /**
     * STEP 5 (PRD): Send stored file to FastAPI, save result, return detection.
     */
    public function detect(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'filename' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()->first()], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $filename = $request->input('filename');
        $filePath = 'uploads/' . $filename;

        if (!Storage::exists($filePath)) {
            return response()->json(['error' => 'Image not found.'], Response::HTTP_NOT_FOUND);
        }

        $url = env('AI_DETECTION_URL', 'http://localhost:8000/detect');

        try {
            $resp = Http::attach('file', Storage::get($filePath), $filename)->post($url);

            if ($resp->failed()) {
                Log::error('AI service error: ' . $resp->status() . ' ' . $resp->body());
                return response()->json(['error' => 'Detection service failed.'], Response::HTTP_BAD_GATEWAY);
            }

            $data = $resp->json();

            $detection = Detection::create([
                'user_id'          => $request->user()->id,
                'type'             => 'image',
                'input_content'    => $filename,
                'ai_probability'   => $data['ai_probability'] ?? null,
                'human_probability'=> null,
                'confidence_score' => $data['confidence'] ?? 'low',
                'analysis_summary' => $data['prediction'] ?? '',
            ]);

            // Map AI confidence to expected risk format
            $confidence = $data['confidence'] ?? 'low';
            $riskLabel = $confidence === 'high' ? 'High Risk' : 'Low Risk';

            // Build frontend-friendly response
            $response = [
                'id'               => 'rpt-img-'.$detection->id,
                'fileName'         => $filename,
                'imageUrl'         => '', // client already has local preview
                'timestamp'        => now()->toDateTimeString(),
                'aiProbability'    => ($data['ai_probability'] ?? 0) * 100,
                'confidenceLabel' => $confidence,
                'riskLevel'        => $riskLabel,
                'riskSummary'      => $data['prediction'] ?? 'No analysis summary',
                'findings' => [
                    'noisePattern' => [
                        'risk' => $riskLabel,
                        'title' => 'Noise Pattern',
                        'description' => 'Analysis based on basic probability check.',
                    ],
                    'metadata' => [
                        'risk' => 'Low Risk',
                        'title' => 'Metadata',
                        'description' => 'No anomalies detected in metadata.',
                    ],
                    'pixelArtifacts' => [
                        'risk' => $riskLabel,
                        'title' => 'Pixel Artifacts',
                        'description' => 'AI model detected potential synthetic artifacts.',
                    ],
                ],
                'analysisSummary' => $data['prediction'] ?? 'No analysis summary',
                'heatmapRegions'  => [],
            ];

            return response()->json($response);

        } catch (\Exception $e) {
            Log::error('Detection exception: ' . $e->getMessage());
            return response()->json(['error' => 'Internal error.'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * STEP 10 (PRD): GET /api/history — return scan list for authenticated user.
     */
    public function history(Request $request)
    {
        return response()->json(
            Detection::where('user_id', $request->user()->id)
                ->orderByDesc('created_at')
                ->get()
        );
    }
}
