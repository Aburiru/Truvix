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
        if ($probability === null) {
            return [
                'confidence_score' => 'N/A',
                'analysis_summary' => 'Analysis not available.'
            ];
        }

        $confidenceScore = '';
        $analysisSummary = '';

        if ($probability < 0.3) {
            $confidenceScore = 'Low AI Confidence';
            $analysisSummary = 'This content is highly likely human-generated.';
        } elseif ($probability >= 0.3 && $probability < 0.7) {
            $confidenceScore = 'Moderate AI Confidence';
            $analysisSummary = 'This content shows some characteristics of AI-generation, but is likely human-generated.';
        } else {
            $confidenceScore = 'High AI Confidence';
            $analysisSummary = 'This content is highly likely AI-generated.';
        }

        return compact('confidence_score', 'analysis_summary');
    }

    public function analyzeText(Request $request)
    {
        $request->validate([
            'text' => 'required|string|max:5000', // Max 5000 characters for now
        ]);

        try {
            $response = Http::timeout(15)->post($this->pythonTextServiceUrl, [
                'text' => $request->input('text'),
            ]);

            if ($response->successful()) {
                $data = $response->json();
                $aiProbability = $data['ai_probability'] ?? null;
                $humanProbability = 1.0 - $aiProbability;

                $confidenceLabel = Confidence::map($aiProbability);
                    $summaryData = $this->getConfidenceAndSummary($aiProbability);

                    $analysis = Auth::user()->analyses()->create([
                        'type' => 'text',
                        'input_content' => $request->input('text'),
                        'ai_probability' => $aiProbability,
                        'human_probability' => $humanProbability,
                        'confidence_score' => $confidenceLabel,
                        'analysis_summary' => $summaryData['analysis_summary'],
                    ]);

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

            if ($response->successful()) {
                $data = $response->json();
                $aiProbability = $data['ai_probability'] ?? null;
                $humanProbability = 1.0 - $aiProbability;

                $confidenceLabel = Confidence::map($aiProbability);
                    $summaryData = $this->getConfidenceAndSummary($aiProbability);

                    $analysis = Auth::user()->analyses()->create([
                        'type' => 'image','
                        'input_content' => $imageName,
                        'ai_probability' => $aiProbability,
                        'human_probability' => $humanProbability,
                        'confidence_score' => $confidenceLabel,
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
