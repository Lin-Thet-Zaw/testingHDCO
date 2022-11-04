<?php

namespace App\Http\Controllers\agency;

use App\Http\Controllers\Controller;
use App\Models\AgencyProfile;
use App\Models\Staff;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class StaffController extends Controller
{
    public function __construct()
    {
        $this->middleware(
            'permission:agency-list|agency-create|agency-edit|agency-delete',
            ['only' => ['index', 'store']]
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
        //get all staffs
        try {
            $profile = AgencyProfile::where(
                'user_id',
                Auth::user()->id
            )->first();
            if (!$profile) {
                return response()->json(['profile_error' => 'Fill profile frist'], 422);
            }
            $staffs = Staff::with('community:id,name')
                ->where('profile_id', $profile->id)
                ->orderBy('id', 'DESC')
                ->get();
            return response()->json($staffs);
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
            'number_of_staff' => 'required|integer',
            'community' => 'required',
        ]);
        try {
            //check profile first
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
            $staff = new Staff();
            $staff->staffs = $request->number_of_staff;
            $staff->community_id = $request->community;
            $staff->profile_id = $profile->id;

            $staff->save();

            $data = Staff::with('community:id,name')->find($staff->id);
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
            'number_of_staff' => 'required|integer',
            'community' => 'required',
        ]);
        try {
            //check profile first
            $profile = AgencyProfile::where(
                'user_id',
                Auth::user()->id
            )->first();
            if (!$profile) {
                return response()->json(
                    ['error' => 'Please fill profile first'],
                    422
                );
            }
            $staff = Staff::where('profile_id', $profile->id)->find($id);
            $staff->staffs = $request->number_of_staff;
            $staff->community_id = $request->community;

            $staff->save();
            $data = Staff::with('community:id,name')->find($id);
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
            $profile = AgencyProfile::where(
                'user_id',
                Auth::user()->id
            )->first();
            $staff = Staff::where('profile_id', $profile->id)->find($id);
            $staff->delete();
            return response()->json($staff);
        } catch (\Exception $e) {
            return $e->getMessage();
        }
    }
}
