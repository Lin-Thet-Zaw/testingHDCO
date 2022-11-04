<?php

namespace App\Http\Controllers\agency;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Travel;
use App\Models\AgencyProfile;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\RequestTravel;
use App\Models\TripAddress;

class TravelController extends Controller
{
    public function __construct()
    {
        $this->middleware(
            'permission:agency-list|agency-create|agency-edit|agency-delete',
            ['only' => ['index', 'store', 'travellist']]
        );
        $this->middleware('permission:agency-create', [
            'only' => ['create', 'store'],
        ]);
        $this->middleware('permission:agency-edit', [
            'only' => ['edit', 'update'],
        ]);
        $this->middleware('permission:agency-delete', ['only' => ['destroy']]);
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $profile = AgencyProfile::where(
            'user_id',
            Auth::user()->id
        )->first();
        if (!$profile) {
            return response()->json(
                [
                    'message' => 'Please fille profile first',
                ],
                422
            );
        }
        if($profile->allowtrip==0){
            return redirect()->back();
        }
        return view('agency.travel.index');
    }

    //get all travel list
    public function travellist()
    {
        //user profile with auth id
        try {
            $profile = AgencyProfile::where(
                'user_id',
                Auth::user()->id
            )->first();
            if (!$profile) {
                return response()->json(
                    [
                        'message' => 'Please fille profile first',
                    ],
                    422
                );
            }
            $travels = Travel::with('trip_addresses')
                ->with('employees')
                ->orderBy('travel.id', 'DESC')
                ->where('travel.profile_id', $profile->id)
                ->paginate(10);
            return response()->json($travels);
        } catch (\Exception $e) {
            return $e->getMessage();
        }
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        return view('agency.travel.create');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(RequestTravel $request)
    {
        try {
            // Check profile already exist
            $profile = AgencyProfile::where(
                'user_id',
                Auth::user()->id
            )->first();
            if (!$profile) {
                return response()->json(
                    [
                        'errors' => [
                            'profile_error' => 'Please fill profile first',
                        ],
                    ],
                    422
                );
            }
            if ($profile) {
                $travel = new Travel();
                $travel->started_date = $request->start_date;
                $travel->end_date = $request->end_date;
                $travel->departure_location = $request->departure_location;
                $travel->phone_number = $request->phone_number;
                $travel->driver = $request->driver;
                $travel->vehicle_type = $request->vehicle_type;
                $travel->vehicle_number = $request->vehicle_number;
                $travel->description = $request->description;
                $travel->profile_id = $profile->id;

                //Save into database
                $travel->save();

                //save into address table

                $addressesInput = $request->address;
                $addresses = [];
                foreach ($addressesInput as $address) {
                    $addresses[] = new TripAddress($address);
                }
                $travel->trip_addresses()->saveMany($addresses);

                $savedTravel = Travel::with('trip_addresses')
                    ->with('employees')
                    ->find($travel->id);
                return response()->json($savedTravel);
            } else {
                return response()->json(['err' => 'Please fill profile first']);
            }
        } catch (\Exception $e) {
            return $e->getMessage();
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        try {
            $profile = AgencyProfile::where(
                'user_id',
                Auth::user()->id
            )->first();
            if (!$profile) {
                return response()->json(['error' => 'Unauthorized data'], 422);
            }
            $travel = Travel::with('trip_addresses.town')
                ->with('employees')
                ->where('profile_id', $profile->id)
                ->find($id);
            return response()->json($travel);
        } catch (\Exception $e) {
            return $e->getMessage();
        }
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        try {
            $profile = AgencyProfile::where(
                'user_id',
                Auth::user()->id
            )->first();
            if (!$profile) {
                return response()->json(['error' => 'Unauthorized data'], 422);
            }
            $travel = Travel::with('trip_addresses')
                ->where('profile_id', $profile->id)
                ->find($id);
            return response()->json($travel);
        } catch (\Exception $e) {
            return $e->getMessage();
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        try {
            $user_id = Auth::user()->id;
            // Check profile already exist
            $profile = AgencyProfile::where('user_id', $user_id)->first();
            if ($profile) {
                $travel = Travel::where('profile_id', $profile->id)->find($id);
                if (!$travel) {
                    return response()->json(['error', 'Travel no found']);
                }
                $travel->started_date = $request->started_date;
                $travel->end_date = $request->end_date;
                $travel->departure_location = $request->departure_location;
                $travel->phone_number = $request->phone_number;
                $travel->driver = $request->driver;
                $travel->vehicle_type = $request->vehicle_type;
                $travel->vehicle_number = $request->vehicle_number;
                $travel->description = $request->description;
                //Save into database
                $travel->save();

                //save into address table

                $addressesInput = $request->address;
                $addresses = [];
                foreach ($addressesInput as $address) {
                    $addresses[] = new TripAddress($address);
                }
                $travel->trip_addresses()->delete();
                $travel->trip_addresses()->saveMany($addresses);

                $savedTravel = Travel::with('trip_addresses')
                    ->with('employees')
                    ->find($travel->id);
                return response()->json($savedTravel);
            } else {
                return response()->json(['err' => 'Please fill profile first']);
            }
        } catch (\Exception $e) {
            return $e->getMessage();
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $user_id = Auth::user()->id;
        $profile = AgencyProfile::where('user_id', $user_id)->first();
        $trip = Travel::where('allow', 0)
            ->where('profile_id', $profile->id)
            ->find($id);
        if (!$trip) {
            return response()->json(['error' => 'Data unauthorized'], 422);
        }
        $trip->delete();

        return response()->json($trip);
    }
}
