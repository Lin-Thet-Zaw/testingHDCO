<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\AgencyType;

class AgencyTypeController extends Controller
{
    public function __construct()
    {
        $this->middleware(
            'permission:role-list|role-create|role-edit|role-delete|agency-list',
            ['only' => ['index', 'store']]
        );
        $this->middleware('permission:role-create', [
            'only' => ['create', 'store'],
        ]);
        $this->middleware('permission:role-edit', [
            'only' => ['edit', 'update'],
        ]);
        $this->middleware('permission:role-delete', ['only' => ['destroy']]);
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $agencytypes = AgencyType::orderBy('id', 'DESC')->get();
        return response()->json($agencytypes);
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
            'name' => ['required'],
        ]);
        $agencytype = new AgencyType();
        $agencytype->name = $request->name;
        $agencytype->save();
        return response()->json([
            'success' => 'Record added successfully!',
            'id' => $agencytype->id,
        ]);
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
            'name' => 'required',
        ]);
        $agencytype = AgencyType::find($id);
        $agencytype->name = $request->name;
        $agencytype->save();
        return response()->json($agencytype);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $agencytype = AgencyType::find($id);
        $agencytype->delete();
        return response()->json(['success' => 'Record deleted successfully!']);
    }
}
