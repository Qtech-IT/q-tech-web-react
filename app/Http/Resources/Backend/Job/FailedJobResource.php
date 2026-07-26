<?php

namespace App\Http\Resources\Backend\Job;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FailedJobResource extends JsonResource
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
        
        // Parse exception for better display
        $exceptionDetails = $this->parseException($this->exception);

        return [
            'id'                => $this->id,
            'uuid'              => $this->uuid,
            'connection'        => $this->connection,
            'queue'             => $this->queue,
            'payload'           => $this->payload,
            'exception'         => $this->exception,
            'failed_at'         => $this->failed_at,
            'display_name'      => $displayName,
            'command_name'      => $commandName,
            'job_data'          => $jobData,
            'exception_message' => $exceptionDetails['message'],
            'exception_class'   => $exceptionDetails['class'],
            'exception_file'    => $exceptionDetails['file'],
            'exception_line'    => $exceptionDetails['line'],
            'exception_trace'   => $exceptionDetails['trace'],
        ];
    }

    /**
     * Extract readable command name from display name
     */
    private function extractCommandName(string $displayName): string
    {
        // Remove namespace and get class name
        $parts     = explode('\\', $displayName);
        $className = end($parts);
        
        // Convert from PascalCase to readable format
        $readable = preg_replace('/(?<!^)[A-Z]/', ' $0', $className);
        
        return $readable;
    }

    /**
     * Parse exception string into structured data
     */
    private function parseException(string $exception): array
    {
        $lines     = explode("\n", $exception);
        $firstLine = $lines[0] ?? '';
        
        // Extract exception class and message
        preg_match('/^([\w\\\\]+):(.+)/', $firstLine, $matches);
        
        $exceptionClass = $matches[1] ?? 'Exception';
        $message = trim($matches[2] ?? $firstLine);
        
        // Extract file and line from second line
        $file = '';
        $line = '';
        
        if (isset($lines[1])) {
            preg_match('/in (.+):(\d+)/', $lines[1], $fileMatches);
            $file = $fileMatches[1] ?? '';
            $line = $fileMatches[2] ?? '';
        }
        
        // Get stack trace (skip first 2 lines)
        $trace = array_slice($lines, 2);
        $trace = implode("\n", $trace);

        return [
            'class'   => $exceptionClass,
            'message' => $message,
            'file'    => $file,
            'line'    => $line,
            'trace'   => $trace,
        ];
    }
}