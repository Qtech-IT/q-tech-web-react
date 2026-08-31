<?php

namespace App\Http\Requests\Backend\Cms;

use App\Enums\Cms\ContentStatus;
use App\Enums\Cms\PageType;
use App\Enums\Common\Status;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PageSaveRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'id' => ['nullable', 'exists:pages,id'],
            'title' => ['required', 'string', 'max:191'],
            'slug' => ['nullable', 'string', 'max:191'],
            'locale' => ['required', 'string', 'max:10', 'exists:languages,code'],
            'translation_group_id' => ['nullable', 'uuid'],
            'parent_id' => ['nullable', 'exists:pages,id'],
            'page_type' => ['required', Rule::in(PageType::getValues())],
            'template' => ['required', 'string', 'max:100'],

            /*
             * Card metadata — used when another page LISTS this one.
             *
             * `excerpt` is capped well under the TEXT column: the cap is a
             * DESIGN constraint, not a storage one. A card clamps to three
             * lines, so anything past roughly this length is written by an
             * editor who cannot see that the rest is being thrown away.
             *
             * `icon` and `accent` are validated as loose strings on purpose.
             * Both resolve against registries that live in the front end — the
             * lucide set in `NavIcon` and the `--fx-mark-*` palette in
             * `frontend.css` — and an unknown value in either degrades to no
             * icon and the cycled accent. Enumerating them here would mean a
             * deploy every time the design system gains a colour, and would
             * fail a save for something that renders fine.
             */
            'excerpt' => ['nullable', 'string', 'max:500'],
            'icon' => ['nullable', 'string', 'max:100'],
            'accent' => ['nullable', 'string', 'max:32'],
            'is_homepage' => ['boolean'],
            'is_indexable' => ['boolean'],
            'settings' => ['nullable', 'array'],

            'status' => ['required', Rule::in(Status::getValues())],

            // Editorial state. Validated here rather than reachable through
            // ModelAction::handleBulkAction(), whose validation is hard-wired
            // to Status::getValues() and whose mass update() bypasses the enum
            // cast entirely.
            'publish_status' => ['required', Rule::in(ContentStatus::getValues())],
            'published_at' => ['nullable', 'date'],
            'expires_at' => ['nullable', 'date', 'after:published_at'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ];
    }

    /**
     * Reject page paths that would collide with a reserved route prefix.
     *
     * /services/cloud as a page and /services/cloud as a module detail route
     * are the same URL. Cheap to check now, a nightmare to discover after
     * launch.
     */
    public function after(): array
    {
        return [
            function (\Illuminate\Validation\Validator $validator): void {
                $slug = make_slug($this->input('slug') ?: $this->input('title'));

                if ($this->filled('parent_id')) {
                    return;
                }

                if (in_array($slug, (array) config('cms.reserved_path_prefixes'), true)) {
                    $validator->errors()->add('slug', translate('That address is reserved by the application.'));
                }
            },
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
