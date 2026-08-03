<?php

namespace App\Http\Controllers;

use App\Models\Analysis;
use App\Helpers\Confidence;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class AnalysisController extends Controller
{
    private $pythonTextServiceUrl;
    private $pythonImageServiceUrl;

    public function __construct()
    {
        $this->pythonTextServiceUrl = env('AI_TEXT_SERVICE_URL', 'http://localhost:5000/detect/text');
        $this->pythonImageServiceUrl = env('AI_IMAGE_SERVICE_URL', 'http://localhost:5001/detect/image');
    }

    private function getConfidenceAndSummary($probability)
    {
        $confidence_score = '';
        $analysis_summary = '';

        if ($probability === null) {
            return [
                'confidence_score' => 'N/A',
                'analysis_summary' => 'Analysis not available.'
            ];
        }

        if ($probability < 0.3) {
            $confidence_score = 'Low AI Confidence';
            $analysis_summary = 'This content is highly likely human-generated.';
        } elseif ($probability >= 0.3 && $probability < 0.7) {
            $confidence_score = 'Moderate AI Confidence';
            $analysis_summary = 'This content shows some characteristics of AI-generation, but is likely human-generated.';
        } else {
            $confidence_score = 'High AI Confidence';
            $analysis_summary = 'This content is highly likely AI-generated.';
        }

        return compact('confidence_score', 'analysis_summary');
    }

    public function analyzeText(Request $request)
    {
        $request->validate([
            'text' => 'required|string|max:5000', // Max 5000 characters for now
        ]);

        try {
            if (!Auth::check()) {
                return response()->json(['message' => 'Unauthenticated.'], 401);
            }

            $response = Http::timeout(15)->post($this->pythonTextServiceUrl, [
                'text' => $request->input('text'),
            ]);

            if ($response->successful()) {
                $data = $response->json();
                $aiProbability = $data['ai_probability'] ?? null;

                if ($aiProbability === null) {
                    return response()->json([
                        'message' => 'AI probability not found in AI text service response.',
                        'response_data' => $data,
                    ], 500);
                }

                $humanProbability = 1.0 - $aiProbability;

                    $summaryData = $this->getConfidenceAndSummary($aiProbability);

                    try {
                        $analysis = Auth::user()->analyses()->create([
                            'type' => 'text',
                            'input_content' => $request->input('text'),
                            'ai_probability' => $aiProbability,
                            'human_probability' => $humanProbability,
                            'confidence_score' => $summaryData['confidence_score'],
                            'analysis_summary' => $summaryData['analysis_summary'],
                        ]);
                    } catch (\Exception $dbException) {
                        return response()->json([
                            'message' => 'Error saving analysis to database.',
                            'db_error' => $dbException->getMessage(),
                        ], 500);
                    }

                return response()->json([
                    'message' => 'Text analysis successful',
                    'analysis' => $analysis,
                ]);
            } else {
                return response()->json([
                    'message' => 'Failed to get response from AI text service',
                    'error' => $response->body(),
                ], $response->status());
            }
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error communicating with AI text service',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function analyzeImage(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg|max:2048', // Max 2MB
        ]);

        try {
            $image = $request->file('image');
            $imageName = 'images/' . Str::uuid() . '.' . $image->getClientOriginalExtension();
            Storage::disk('public')->put($imageName, file_get_contents($image->getRealPath()));

            $response = Http::timeout(20)->attach(
                'image',
                file_get_contents(Storage::disk('public')->path($imageName)),
                $imageName
            )->post($this->pythonImageServiceUrl);

            // Clean up temporary image file after sending
            Storage::disk('public')->delete($imageName);

            if (!Auth::check()) {
                return response()->json(['message' => 'Unauthenticated.'], 401);
            }

            if ($response->successful()) {
                $data = $response->json();
                $aiProbability = $data['ai_probability'] ?? null;

                if ($aiProbability === null) {
                    return response()->json([
                        'message' => 'AI probability not found in AI image service response.',
                        'response_data' => $data,
                    ], 500);
                }

                $humanProbability = 1.0 - $aiProbability;

                    $summaryData = $this->getConfidenceAndSummary($aiProbability);

                    $analysis = Auth::user()->analyses()->create([
                        'type' => 'image',
                        'input_content' => $imageName,
                        'ai_probability' => $aiProbability,
                        'human_probability' => $humanProbability,
                        'confidence_score' => $summaryData['confidence_score'],
                    'analysis_summary' => $summaryData['analysis_summary'],
                    ]);

                return response()->json([
                    'message' => 'Image analysis successful',
                    'analysis' => $analysis,
                ]);
            } else {
                return response()->json([
                    'message' => 'Failed to get response from AI image service',
                    'error' => $response->body(),
                ], $response->status());
            }
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error communicating with AI image service',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function getAnalyses()
    {
        $analyses = Auth::user()->analyses()->latest()->get();
        return response()->json([
            'message' => 'Analyses retrieved successfully',
            'analyses' => $analyses,
        ]);
    }
}