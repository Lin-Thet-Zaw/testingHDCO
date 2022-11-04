<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Community;

class CommunityController extends Controller
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
        $communities = Community::orderBy('id', 'DESC')->get();
        return response()->json($communities);
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
        $community = new Community();
        $community->name = $request->name;
        $community->save();
        return response()->json([
            'success' => 'Record added successfully!',
            'id' => $community->id,
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
        $community = Community::find($id);
        $community->name = $request->name;
        $community->save();
        return response()->json($community);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $community = Community::find($id);
        $community->delete();
        return response()->json(['success' => 'Record deleted successfully!']);
    }
}
