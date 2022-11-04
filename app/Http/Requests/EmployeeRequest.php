<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EmployeeRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        if ($this->isMethod('PUT')) {
            return [
                'name' => 'required|string|min:2|max:100',
                'nationality' => 'required|integer',
                'position' => 'required|string|min:1|max:100',
                'sex' => 'required',
                'frontid' => 'nullable|image|mimes:jpeg,jpg,png|max:300',
                'backid' => 'nullable|image|mimes:jpeg,jpg,png|max:300',
                'passport_photo' =>
                    'nullable|image|mimes:jpeg,jpg,png|max:200',
            ];
        } else {
            return [
                'name' => 'required|string|min:2|max:100',
                'nationality' => 'required|integer',
                'position' => 'required|string|min:1|max:100',
                'sex' => 'required',
                'frontid' => 'required|image|mimes:jpeg,jpg,png|max:300',
                'backid' => 'required|image|mimes:jpeg,jpg,png|max:300',
                'passport_photo' =>
                    'required|image|mimes:jpeg,jpg,png|max:200',
            ];
        }
    }
}
