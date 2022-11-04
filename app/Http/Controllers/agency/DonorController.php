<?php

namespace App\Http\Controllers\agency;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Donor;
use App\Models\AgencyProfile;
use Illuminate\Support\Facades\Auth;

class DonorController extends Controller
{
    public function __construct()
    {
        $this->middleware(
            'permission:agency-list|agency-create|agency-edit|agency-delete',
            ['only' => ['index', 'store', 'donors']]
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
        return view('agency.donors.index');
    }

    //get all data list
    public function donors()
    {
        $profile = AgencyProfile::where('user_id', Auth::user()->id)->first();
        if (!$profile) {
            return response()->json(['error' => 'Unauthorized data'], 422);
        }
        $donors = Donor::orderBy('id', 'DESC')
            ->where('profile_id', $profile->id)
            ->get();
        return response()->json($donors);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:200',
        ]);
        try {
            //First check profile already exist
            $profile = AgencyProfile::where(
                'user_id',
                Auth::user()->id
            )->first();

            if (!$profile) {
                return response()->json(
                    ['errors' => ['profile_error'=>'Please fill general information first']],
                    422
                );
            }
            $donor = new Donor();
            $donor->name = $request->name;
            $donor->profile_id = $profile->id;
            $donor->save();

            return response()->json($donor);
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
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
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
        $request->validate([
            'name' => 'required|string|max:200',
        ]);
        try {
            //First check profile already exist
            $profile = AgencyProfile::where(
                'user_id',
                Auth::user()->id
            )->first();

            if (!$profile) {
                return response()->json([
                    'message' => 'Please fill profile first',
                ]);
            }
            $donor = Donor::where('profile_id', $profile->id)->find($id);
            if (!$donor) {
                return response()->json(['error' => 'Unauthorized data']);
            }
            $donor->name = $request->name;
            $donor->save();

            return response()->json($donor);
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
        try {
            //First check profile already exist
            $profile = AgencyProfile::where(
                'user_id',
                Auth::user()->id
            )->first();

            if (!$profile) {
                return response()->json([
                    'message' => 'Please fill profile first',
                ]);
            }
            $donor = Donor::where('profile_id', $profile->id)->find($id);
            if (!$donor) {
                return response()->json(['error' => 'Unauthorized data']);
            }
            $donor->delete();

            return response()->json($donor);
        } catch (\Exception $e) {
            return $e->getMessage();
        }
    }
}
