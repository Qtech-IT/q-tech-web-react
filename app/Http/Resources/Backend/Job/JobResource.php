<?php

namespace App\Http\Resources\Backend\Job;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class JobResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // Decode the payload to extract job details
        $payload     = json_decode($this->payload, true);
        $jobData     = $payload['data'] ?? [];
        $displayName = $payload['displayName'] ?? 'Unknown Job';
        
        // Extract command name from display name
        $commandName = $this->extractCommandName($displayName);

        return [
            'id'           => $this->id,
            'queue'        => $this->queue,
            'attempts'     => $this->attempts,
            'reserved_at'  => $this->reserved_at ? date('Y-m-d H:i:s', $this->reserved_at) : null,
            'available_at' => date('Y-m-d H:i:s', $this->available_at),
            'created_at'   => date('Y-m-d H:i:s', $this->created_at),
            'payload'      => $this->payload,
            'display_name' => $displayName,
            'command_name' => $commandName,
            'job_data'     => $jobData,
        ];
    }

    /**
     * Extract readable command name from display name
     */
    private function extractCommandName(string $displayName): string
    {
        // Remove namespace and get class name
        $parts = explode('\\', $displayName);
        $className = end($parts);
        
        // Convert from PascalCase to readable format
        $readable = preg_replace('/(?<!^)[A-Z]/', ' $0', $className);
        
        return $readable;
    }
}