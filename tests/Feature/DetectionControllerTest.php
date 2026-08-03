<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Detection;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class DetectionControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_image_upload_and_detection_multi_step()
    {
        Storage::fake('local');

        $user = User::factory()->create();
        $file = UploadedFile::fake()->image('photo.jpg');

        // STEP 1: Upload
        $uploadRes = $this->actingAs($user)->postJson('/api/detect/image', [
            'image' => $file,
        ]);

        $uploadRes->assertStatus(200)
            ->assertJson(['uploaded' => true])
            ->assertJsonStructure(['filename']);

        $filename = $uploadRes->json('filename');
        Storage::disk('local')->assertExists('uploads/' . $filename);

        // STEP 2: Process Detection
        Http::fake([
            '*' => Http::response([
                'prediction' => 'AI Generated',
                'ai_probability' => 0.95,
                'confidence' => 'high',
            ], 200),
        ]);

        $detectRes = $this->actingAs($user)->postJson('/api/detect/image/process', [
            'filename' => $filename,
        ]);

        $detectRes->assertStatus(200)
            ->assertJson([
                'type' => 'image',
                'input_content' => $filename,
                'confidence_score' => 'high',
            ]);

        $this->assertDatabaseHas('detections', [
            'user_id' => $user->id,
            'input_content' => $filename,
        ]);
    }

    public function test_history_endpoint()
    {
        $user = User::factory()->create();
        Detection::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->getJson('/api/history');

        $response->assertStatus(200)
            ->assertJsonCount(1);
    }
}
