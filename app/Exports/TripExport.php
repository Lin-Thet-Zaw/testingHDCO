<?php

namespace App\Exports;

use App\Models\Travel;
use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;

class TripExport implements FromView
{
    protected $id;

    function __construct($id) {
        $this->id = $id;
    }
    /**
    * @return \Illuminate\Support\Collection
    */
    public function view(): View
    {
        if($this->id==0){
            return view('adminpanel.export.trips', [
                'trips' => Travel::with('trip_addresses.town')->with('employees')->with('profile')->where('allow', 0)->get()
            ]);
        }else{
            return view('adminpanel.export.trips', [
                'trips' => Travel::with('trip_addresses.town')->with('employees')->with('profile')->where('allow', 0)->whereHas('trip_addresses', function($q){
                    $q->where('town_id', $this->id);
                })->get()
            ]);
        }
    }
}
