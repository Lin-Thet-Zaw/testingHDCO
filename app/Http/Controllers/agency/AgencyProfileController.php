<?php

namespace App\Http\Controllers\agency;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\ProfileRequest;
use App\Models\AgencyProfile;
use App\Models\Town;
use Intervention\Image\Facades\Image;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
class AgencyProfileController extends Controller
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
        return view('agency.profile.profile');
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
    public function store(ProfileRequest $request)
    {
        try {
            //check profile already exist with this id
            $user_id = Auth::user()->id;
            $agencyprofile = AgencyProfile::where('user_id', $user_id)->first();
            if (!$agencyprofile) {
                if ($request->hasFile('logo')) {
                    $type = $request->file('logo')->extension();
                    $image = 'data:image/'.$type.';base64,'.base64_encode(file_get_contents($request->file('logo')));
                }
                $profile = new AgencyProfile();
                $profile->name = $request->name;
                $profile->website = $request->website;
                $profile->socialmedia = $request->socialmedia;
                $profile->country_address = $request->country_address;
                $profile->rakhine_address = $request->rakhine_address;
                $profile->funded_organizations = $request->funded_organizations;
                $profile->town_id = $request->town;
                $profile->phonenumber = $request->phone_number;
                $profile->email = $request->email;
                $profile->started_date = $request->started_date;
                $profile->agencytype_id = $request->type;
                $profile->user_id = $user_id;
                $profile->logo = $image;
                //Save data into database
                $profile->save();
                //return saved data
                return response()->json($profile);
            } else {
                return response()->json($agencyprofile);
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
                return response()->json(['error' => 'Profile no found'], 422);
            }
            //$profile->logo = mb_convert_encoding($profile->logo, 'UTF-8', 'UTF-8');
            // $profile->logo= base64_decode($profile->logo);
            return response()->json(['profile' => $profile]);
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
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(ProfileRequest $request, $id)
    {
        try {
            $profile = AgencyProfile::where('user_id', Auth::user()->id)->find(
                $id
            );
            if (!$profile) {
                return response()->json(['error' => 'Unauthorized profile']);
            }
            if ($request->hasFile('logo')) {
                $type = $request->file('logo')->extension();
                $image = 'data:image/'.$type.';base64,'.base64_encode(file_get_contents($request->file('logo')));
                $profile->logo = $image;
            }
            //Find id
            $profile->name = $request->name;
            $profile->website = $request->website;
            $profile->socialmedia = $request->socialmedia;
            $profile->country_address = $request->country_address;
            $profile->rakhine_address = $request->rakhine_address;
            $profile->funded_organizations = $request->funded_organizations;
            $profile->town_id = $request->town;
            $profile->phonenumber = $request->phone_number;
            $profile->email = $request->email;
            $profile->started_date = $request->started_date;
            $profile->agencytype_id = $request->type;

            //Save data into database
            $profile->save();
            //return saved data
            return response()->json($profile);
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
        //
    }
}
