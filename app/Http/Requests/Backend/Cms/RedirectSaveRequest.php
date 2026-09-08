<?php

namespace App\Http\Requests\Backend\Cms;

use App\Enums\Cms\RedirectSource;
use App\Enums\Common\Status;
use App\Models\Redirect;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class RedirectSaveRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $redirectId = $this->route('redirect')?->id;

        return [
            'from_path' => ['required', 'string', 'max:500'],
            'to_path' => ['required', 'string', 'max:500'],

            // Uniqueness is on from_hash, not from_path: a VARCHAR(500) unique
            // index in utf8mb4 is a 2000-byte key, and the whole repo
            // standardises on 191 for indexed strings to avoid exactly that.
            'from_hash' => [
                Rule::unique('redirects', 'from_hash')
                    ->ignore($redirectId)
                    ->whereNull('deleted_at'),
            ],

            'status_code' => ['required', 'integer', Rule::in(Redirect::STATUS_CODES)],
            'is_regex' => ['boolean'],
            'preserve_query' => ['boolean'],
            'source' => ['required', Rule::in(RedirectSource::getValues())],
            'status' => ['required', Rule::in(Status::getValues())],
        ];
    }

    /**
     * Compute from_hash so the unique rule above has something to check, using
     * exactly the same normalisation the service and the resolver use. If
     * these three ever disagree the lookup silently misses.
     */
    protected function prepareForValidation(): void
    {
        if (! $this->filled('from_path')) {
            return;
        }

        $this->merge([
            'from_hash' => Redirect::hashFor($this->input('from_path'), (int) config('cms.site_id')),
        ]);
    }

    /**
     * Reject the two rules that are always a bug: a redirect to itself, and a
     * regex that does not compile.
     */
    public function after(): array
    {
        return [
            function (Validator $validator): void {
                $from = Redirect::normalizePath((string) $this->input('from_path'));
                $to = Redirect::normalizePath((string) $this->input('to_path'));

                if (! $this->boolean('is_regex') && $from === $to) {
                    $validator->errors()->add('to_path', translate('A redirect cannot point at itself.'));
                }

                if ($this->boolean('is_regex') && @preg_match('#'.$this->input('from_path').'#', '') === false) {
                    $validator->errors()->add('from_path', translate('That pattern is not a valid regular expression.'));
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
