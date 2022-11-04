<?php

namespace App\Http\Controllers\agency;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Travel;
use App\Models\Employee;
use Illuminate\Support\Facades\Auth;
use App\Models\AgencyProfile;

class EmployeeTravelController extends Controller
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
    // get travel user with travel id
    public function index($id)
    {
        try {
            $user_id = Auth::user()->id;
            //Find user profile
            $profile = AgencyProfile::where('user_id', $user_id)->first();
            if (!$profile) {
                return response()->json(
                    [
                        'message' => 'Please fille profile first',
                    ],
                    422
                );
            }

            $travellers = Employee::whereHas('travel', function ($q) use ($id) {
                $q->where('travel.id', "$id");
            })
                ->where('agencyprofile_id', $profile->id)
                ->select('employees.id')
                ->get();
            return response()->json([
                'travellers' => $travellers,
            ]);
        } catch (\Exception $e) {
            return $e->getMessage();
        }
    }

    public function store(Request $request, $id)
    {
        try {
            $travel = Travel::find($id);
            if (!$travel) {
                return response()->json(['error' => 'Trip no found!']);
            }
            $travellers = $request->travellers;
            $travel->employees()->sync($travellers);
            return response()->json([
                'travel_id' => $id,
                'travellers' => $travel->employees,
            ]);
        } catch (\Exception $e) {
            return $e->getMessage();
        }
    }
}
