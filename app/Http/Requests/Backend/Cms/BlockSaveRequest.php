<?php

namespace App\Http\Requests\Backend\Cms;

use App\Enums\Cms\ContentStatus;
use App\Enums\Common\Status;
use App\Http\Services\Backend\Cms\SectionTypeRegistry;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class BlockSaveRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $blockId = $this->route('block')?->id;

        return [
            'key' => [
                'required',
                'string',
                'max:100',
                Rule::unique('blocks', 'key')
                    ->where('site_id', config('cms.site_id'))
                    ->ignore($blockId)
                    ->whereNull('deleted_at'),
            ],
            'name' => ['required', 'string', 'max:191'],
            'description' => ['nullable', 'string', 'max:500'],
            'section_type' => ['required', 'string', 'max:100', Rule::in(app(SectionTypeRegistry::class)->keys())],

            'status' => ['required', Rule::in(Status::getValues())],
            'publish_status' => ['required', Rule::in(ContentStatus::getValues())],
            'published_at' => ['nullable', 'date'],
            'expires_at' => ['nullable', 'date', 'after:published_at'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ];
    }

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }
}
