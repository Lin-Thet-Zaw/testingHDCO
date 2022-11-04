<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Request;

class ContactPersonRequest extends FormRequest
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
    public function rules(Request $request)
    {
        if ($this->isMethod('PUT')) {
            return [
                'frontid' => 'nullable|image|mimes:png,jpg,jpeg|max:300',
                'backid' => 'nullable|image|mimes:png,jpg,jpeg|max:300',
                'passport_photo' =>
                    'nullable|image|mimes:png,jpg,jpeg|max:200',
                'name' => 'required|string|max:100',
                'nationality' => 'required',
                'phone_number' => 'required|regex:/(09)[0-9]{9}/',
                'email' => 'required|email|max:100',
                'position' => 'required|string|max:100',
                'sex' => 'required',
            ];
        } else {
            return [
                'frontid' => 'required|image|mimes:png,jpg,jpeg|max:300',
                'backid' => 'required|image|mimes:png,jpg,jpeg|max:300',
                'passport_photo' =>
                    'required|image|mimes:png,jpg,jpeg|max:200',
                'name' => 'required|string|max:100',
                'nationality' => 'required',
                'phone_number' => 'required|regex:/(09)[0-9]{9}/',
                'email' => 'required|email|max:100',
                'position' => 'required|string|max:100',
                'sex' => 'required',
            ];
        }
    }
}
