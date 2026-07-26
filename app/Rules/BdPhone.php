<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class BdPhone implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string, ?string=): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $pattern = '/^(?:\+880|880|0)1[3-9]\d{8}$/';
        if (! is_string($value) || ! preg_match($pattern, $value)) {
            $fail(translate('Invalid Bangladeshi phone number.'));
        }
    }
}
