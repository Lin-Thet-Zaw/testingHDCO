<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RequestTravel extends FormRequest
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
        return [
            'start_date' => 'required|date|after:+2 week',
            'end_date' => 'required|date|after_or_equal:start_date',
            'departure_location' => 'required|string|max:200',
            'phone_number' => 'required|regex:/(09)[0-9]{9}/',
            'driver' => 'required|string|max:100',
            'vehicle_type' => 'required|string|max:100',
            'description' => 'required|string|max:700',
        ];
    }
}
