<?php

namespace App\Http\Controllers\agency;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\AgencyProfile;
use App\Models\Office;
class OfficeController extends Controller
{
    public function __construct()
    {
        $this->middleware(
            'permission:agency-list|agency-create|agency-edit|agency-delete',
            ['only' => ['index', 'store', 'offices']]
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
        return view('agency.offices.index');
    }

    //get offices
    public function offices()
    {
        $user_id = Auth::user()->id;
        //Find user profile
        $profile = AgencyProfile::where('user_id', $user_id)->first();
        if (!$profile) {
            return response()->json(
                [
                    'message' => 'Please fill profile first',
                ],
                422
            );
        }

        $offices = Office::with('town:id,name')
            ->where('profile_id', $profile->id)
            ->orderBy('id', 'DESC')
            ->get();

        return response()->json($offices);
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
            'address' => 'required|string|max:200',
            'town_id' => 'required',
            'staffs' => 'required|integer',
        ]);
        try {
            $user_id = Auth::user()->id;
            //Find user profile
            $profile = AgencyProfile::where('user_id', $user_id)->first();
            if (!$profile) {
                return response()->json(
                    ['errors' => ['profile_error'=>'Please fill general information first']],
                    422
                );
            }
            $office = new Office();
            $office->address = $request->address;
            $office->town_id = $request->town_id;
            $office->staffs = $request->staffs;
            $office->profile_id = $profile->id;
            //save into database
            $office->save();

            $data = Office::with('town:id,name')->find($office->id);
            //return data
            return response()->json($data);
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
            'address' => 'required|string|max:200',
            'town_id' => 'required',
            'staffs' => 'required|integer',
        ]);
        try {
            $user_id = Auth::user()->id;
            //Find user profile
            $profile = AgencyProfile::where('user_id', $user_id)->first();
            if (!$profile) {
                return response()->json([
                    'message' => 'Please fille profile first',
                ]);
            }
            $office = Office::where('profile_id', $profile->id)->find($id);
            if (!$office) {
                return response()->json(['error' => 'Unauthorized data']);
            }
            $office->address = $request->address;
            $office->town_id = $request->town_id;
            $office->staffs = $request->staffs;
            //save into database
            $office->save();

            $data = Office::with('town:id,name')->find($office->id);
            //return data
            return response()->json($data);
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
            $user_id = Auth::user()->id;
            //Find user profile
            $profile = AgencyProfile::where('user_id', $user_id)->first();
            if (!$profile) {
                return response()->json([
                    'message' => 'Please fille profile first',
                ]);
            }
            $office = Office::where('profile_id', $profile->id)->find($id);
            if (!$office) {
                return response()->json(['error' => 'Unauthorized data']);
            }

            $office->delete();

            return response()->json($office);
        } catch (\Exception $e) {
            return $e->getMessage();
        }
    }
}
