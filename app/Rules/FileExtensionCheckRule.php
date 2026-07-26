<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class FileExtensionCheckRule implements ValidationRule
{
    private array $allowedExtensions;

    /**
     * Create a new rule instance.
     *
     * @param array|string $extensions - Allowed extensions (e.g., ['pdf', 'doc', 'docx'] or 'pdf|doc|docx')
     */
    public function __construct(array $extensions = [])
    {
       $this->allowedExtensions = array_map('strtolower', $extensions);

    }

    /**
     * Run the validation rule.
     *
     * @param  \Closure(string, ?string=): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        // Handle UploadedFile or file path
        if (is_null($value)) return;

        // Get file extension
        $extension = strtolower(pathinfo($value->getClientOriginalName(), PATHINFO_EXTENSION));

        // Check if extension is allowed
        if (!in_array($extension, $this->allowedExtensions)) {
            $fail("The {$attribute} field must be one of the following types: " . implode(', ', $this->allowedExtensions));
        }
    }
}