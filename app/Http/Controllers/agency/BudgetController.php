<?php

namespace App\Http\Controllers\agency;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Budget;
use App\Models\AgencyProfile;
use Illuminate\Support\Facades\Auth;

class BudgetController extends Controller
{
    public function __construct()
    {
        $this->middleware(
            'permission:agency-list|agency-create|agency-edit|agency-delete',
            ['only' => ['index', 'store', 'budgets']]
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
        return view('agency.budget.index');
    }

    public function budgets()
    {
        $profile = AgencyProfile::where('user_id', Auth::user()->id)->first();

        if (!$profile) {
            return response()->json(['error' => 'Fill profile first'], 422);
        }
        $budgets = Budget::where('profile_id', $profile->id)
            ->orderBy('id', 'DESC')
            ->get();

        return response()->json($budgets);
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
            'year'=>'required|integer',
            'budget' => 'required|integer',
            'address' => 'required',
        ]);
        try {
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

            $buget = new Budget();

            $buget->amount = $request->budget;
            $buget->address = $request->address;
            $buget->year = $request->year;
            $buget->profile_id = $profile->id;

            $buget->save();

            return response()->json($buget);
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
            'year'=>'required|integer',
            'budget' => 'required|integer',
            'address' => 'required',
        ]);
        try {
            $profile = AgencyProfile::where(
                'user_id',
                Auth::user()->id
            )->first();

            if (!$profile) {
                return response()->json(['error' => 'Fill profile first'], 422);
            }

            $buget = Budget::where('profile_id', $profile->id)->find($id);

            $buget->amount = $request->budget;
            $buget->address = $request->address;
            $buget->year = $request->year;

            $buget->save();

            return response()->json($buget);
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
        $profile = AgencyProfile::where('user_id', Auth::user()->id)->first();

        if (!$profile) {
            return response()->json(['error' => 'Fill profile first'], 422);
        }

        $budget = Budget::where('profile_id', $profile->id)->find($id);
        if (!$budget) {
            return response()->json(['err' => 'No found'], 404);
        }
        $budget->delete();

        return response()->json($budget);
    }
}
