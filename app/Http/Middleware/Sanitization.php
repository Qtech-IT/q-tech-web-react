<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class Sanitization
{
    /**
     * Handle an incoming request and sanitize all input data.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next): Response
    {
        $input = $request->all();

        // Sanitize recursively
        $sanitizedInput = $this->sanitizeArray($input);

        // Replace request input with sanitized values
        $request->replace($sanitizedInput);

        return $next($request);
    }

    /**
     * Recursively sanitize array inputs.
     *
     * @param array $input
     * @return array
     */
    protected function sanitizeArray(array $input): array
    {
        foreach ($input as $key => $value) {
            if (is_array($value)) {
                $input[$key] = $this->sanitizeArray($value);
            } elseif (is_string($value)) {
                $input[$key] = $this->sanitizeString($value);
            }
        }

        return $input;
    }

    /**
     * Remove dangerous HTML and script tags from a string.
     *
     * @param string $value
     * @return string
     */
    protected function sanitizeString(string $value): string
    {
        // Decode HTML entities
        $cleanValue = htmlspecialchars_decode($value);

        // Remove <script> tags (all variations)
        $cleanValue = preg_replace("/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/is", '', $cleanValue);

        // Optionally, you can also remove inline event handlers like onclick, onload, etc.
        $cleanValue = preg_replace('/on\w+="[^"]*"/i', '', $cleanValue);

        return $cleanValue;
    }

    /**
     * Optional: Use DOMDocument to safely remove <script> tags from full HTML content.
     *
     * @param string $value
     * @return string
     */
    protected function sanitizeHtml(string $value): string
    {
        libxml_use_internal_errors(true);
        $dom = new \DOMDocument();

        // Load HTML safely
        $dom->loadHTML(mb_convert_encoding($value, 'HTML-ENTITIES', 'UTF-8'), LIBXML_HTML_NODEFDTD);

        // Remove all <script> tags
        $scriptTags = $dom->getElementsByTagName('script');
        while ($scriptTags->length > 0) {
            $scriptTag = $scriptTags->item(0);
            $scriptTag->parentNode->removeChild($scriptTag);
        }

        libxml_clear_errors();

        return $dom->saveHTML();
    }
}
