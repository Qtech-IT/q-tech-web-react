<?php
namespace App\Http\Requests\Backend;

use App\Constants\GlobalConfig as ConstantsGlobalConfig;
use App\Enums\Settings\LanguageDirection;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class LanguageSaveRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        $langCodes = collect(ConstantsGlobalConfig::LANG_CODES)
                                    ->pluck('lang_code')
                                    ->toArray();
        return [
            'id'            => 'nullable|exists:settings,id',
            'name'          => 'required|max:100',
            'code'          => 'required|max:100|in:' . implode(',', $langCodes),
            'direction'     => ['required' ,  Rule::in(LanguageDirection::getValues())],
        ];
    }

    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }
}