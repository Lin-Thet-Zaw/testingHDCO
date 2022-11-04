<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\AgencyProfile;
use Illuminate\Support\Facades\DB;
use App\Models\Travel;
use Illuminate\Support\Facades\Storage;

class AgencyProfileController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:profile-list', [
            'only' => ['index', 'profiles', 'show', 'showdata', 'allowtriprequest'],
        ]);
    }
    //view for profile list of admin
    public function index()
    {
        return view('adminpanel.agencyprofile.index');
    }

    //get list of all profiles
    public function profiles()
    {
        try {
            $profiles = AgencyProfile::with('agencytype')
                ->with('town:id,name')
                ->with('offices')
                ->orderBy('id', 'DESC')
                ->paginate(10);
            return response()->json($profiles);
        } catch (\Exception $e) {
            return $e->getMessage();
        }
    }

    //get agency profile detail
    public function show($id)
    {
        try {
            return view('adminpanel.agencyprofile.show');
        } catch (\Exception $e) {
            return $e->getMessage();
        }
    }

    //get each data
    public function showdata($id)
    {
        try {
            $profile = AgencyProfile::with('agencytype:id,name')
                ->with('town:id,name')
                ->with('staffs.community')
                ->with('contacts.nationality')
                ->with('budgets')
                ->with('donors')
                ->with('offices.town')
                ->with('responses')
                ->find($id);

            if (!$profile) {
                return response()->json(['error' => 'Porfile no found']);
            }

            return response()->json($profile);
        } catch (\Exception $e) {
            return $e->getMessage();
        }
    }

    //download excel file
    public function downloadfile($file = null)
    {
        try {
            $filename = Storage::disk('xlsx')->path('/uploads/' . $file);
            return response()->download($filename);
        } catch (\Exception $e) {
            return $e->getMessage();
        }
    }

    //allow profile to make trip request
    public function allowtriprequest(Request $request, $id){
        try {
            
            $profile = AgencyProfile::find($id);
            $profile->allowtrip = !$profile->allowtrip;
            $profile->save();

            return response()->json($profile);

        } catch (\Exception $e) {
            return $e->getMessage();
        }
    }
}
