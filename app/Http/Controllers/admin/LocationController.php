<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\Location;
use Illuminate\Http\Request;

class LocationController extends Controller
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
        try {
            $locations = Location::all();

            return response()->json($locations);
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
            'name' => ['required'],
        ]);
        try {
            $location = new Location();
            $location->name = $request->name;
            $location->save();
            return response()->json([
                'success' => 'Record added successfully!',
                'id' => $location->id,
            ]);
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
            'name' => ['required'],
        ]);
        try {
            $location = Location::find($id);
            $location->name = $request->name;
            $location->save();
            return response()->json([
                'success' => 'Record added successfully!',
                'id' => $location->id,
            ]);
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
            $location = Location::find($id);
            $location->delete();
            return response()->json([
                'success' => 'Record deleted successfully!',
            ]);
        } catch (\Exception $e) {
            return $e->getMessage();
        }
    }
}
