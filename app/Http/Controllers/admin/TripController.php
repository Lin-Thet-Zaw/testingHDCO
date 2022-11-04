<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Travel;
use App\Mail\TripMail;
use Illuminate\Support\Facades\Mail;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Models\EmailList;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\TripExport;

class TripController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:trip-list|trip-allow', [
            'only' => [
                'index',
                'trips',
                'allowedtrips',
                'tripdetail',
                'show',
                'store',
                'update',
                'tripview',
                'export',
                'viewpdf'
            ],
        ]);
    }
    //
    public function index()
    {
        return view('adminpanel.trips.agencytrips');
    }

    //allowed trips
    public function allowedtrips()
    {
        return view('adminpanel.trips.allowedtrips');
    }

    //get all trips
    public function trips($allow = 0)
    {
        try {
            $trips = Travel::with('employees')
                ->with('profile')
                ->with('trip_addresses')
                ->where('allow', $allow)
                ->orderBy('id', 'DESC')
                ->paginate(10);

            return response()->json($trips);
        } catch (\Exception $e) {
            return $e->getMessage();
        }
    }

    //trip detail view
    public function tripdetail($id)
    {
        try {
            $trip = Travel::with('employees.nationality')
                ->with('profile')
                ->with('trip_addresses.town')
                ->orderBy('id', 'DESC')
                ->find($id);

            return response()->json($trip);
        } catch (\Exception $e) {
            return $e->getMessage();
        }
    }

    //shwo trip detail
    public function show($id)
    {
        return view('adminpanel.trips.detail');
    }

    //response trip
    public function store(Request $request, $id)
    {
        try {
            $trip = Travel::find($id);
            if (!$trip) {
                return response()->json(['error', 'Trip no found'], 422);
            }

            return response()->json($trip);
        } catch (\Exception $e) {
            return $e->getMessage();
        }
    }

    //pdf file view in web page
    public function tripview($id)
    {
        $trip = Travel::with('employees.nationality')
            ->with('profile')
            ->with('trip_addresses.town')
            ->orderBy('id', 'DESC')
            ->findOrFail($id);
        return view('pdf.trip', compact('trip'));
    }

    //update trip response
    public function update(Request $request, $id)
    {
        try {
                $trip = Travel::with(['employees.nationality', 'profile', 'trip_addresses.town', 'trip_addresses'=>function($q){
                    $q->where('status', 1);
                }])
                ->orderBy('id', 'DESC')
                ->find($id);
            if (!$trip) {
                return response()->jon(['error' => 'Trip no found'], 422);
            }
            $emails = EmailList::select('email')->get();
            $emails->put('email', $trip->profile->email);

            $pdf = PDF::loadView('pdf.trip', compact('trip'));
            //Send mail
            Mail::to($emails)->send(new TripMail($pdf));
            $trip->allow = $request->allow;
            $trip->save();
            return response()->json($trip);
        } catch (\Exception $e) {
            return $e->getMessage();
        }
    }

    //update trip address allow or denie
    public function updateaddress(Request $request, $id)
    {
        try {
            $trip = Travel::find($id);
            if (!$trip) {
                return response()->json(['error' => 'Trip no found']);
            }

            $tripaddress = $trip
                ->trip_addresses()
                ->where('id', $request->addressId)
                ->get()
                ->first();
            $tripaddress->status = !$tripaddress->status;
            $tripaddress->save();

            return response()->json($tripaddress);
        } catch (\Exception $e) {
            return $e->getMessage();
        }
    }


      //update trip response
      public function viewpdf($id)
      {
          try {
                  $trip = Travel::with(['employees.nationality', 'profile', 'trip_addresses.town', 'trip_addresses'=>function($q){
                      $q->where('status', 1);
                  }])
                  ->orderBy('id', 'DESC')
                  ->find($id);
              if (!$trip) {
                  return response()->jon(['error' => 'Trip no found'], 422);
              }
  
              $pdf = PDF::loadView('pdf.trip', compact('trip'));
              return $pdf->download('test.pdf');
          } catch (\Exception $e) {
              return $e->getMessage();
          }
      }

      //export to excel file
      public function export($id){
          return Excel::download(new TripExport($id), 'trips.xlsx');
      }

    
}
