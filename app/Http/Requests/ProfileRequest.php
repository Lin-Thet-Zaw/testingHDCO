<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Request;

class ProfileRequest extends FormRequest
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
                'name' => 'required|string|min:2|max:150',
                'phone_number' => 'required|regex:/(09)[0-9]{9}/',
                'email' =>
                    'required|email|max:80|unique:agency_profiles,email,' .
                    $request->route()->parameters['profile'],
                'website' => 'nullable|url|max:200',
                'socialmedia' => 'nullable|url|max:225',
                'country_address' => 'required|string|min:3|max:200',
                'rakhine_address' => 'required|string|min:3|max:200',
                'started_date' => 'required|date',
                'type' => 'required|integer',
                'logo' => 'nullable|image|mimes:png,jpg,jpeg|max:300',
                'town' => 'required',
                'funded_organizations'=>'required|string|max:200'
            ];
        } else {
            return [
                'name' => 'required|string|min:2|max:150',
                'phone_number' => 'required|regex:/(09)[0-9]{9}/',
                'email' => 'required|email|unique:agency_profiles,email|max:80',
                'website' => 'nullable|url|max:200',
                'socialmedia' => 'nullable|url|max:225',
                'country_address' => 'required|string|min:3|max:200',
                'rakhine_address' => 'required|string|min:3|max:200',
                'started_date' => 'required|date',
                'type' => 'required|integer',
                'logo' => 'required|image|mimes:png,jpg,jpeg|max:300',
                'town'=>'required',
                'funded_organizations'=>'required|string|max:200'
            ];
        }
    }
}
