<?php

namespace App\Http\Controllers\agency;

use App\Http\Controllers\Controller;
use App\Models\Response;
use Illuminate\Http\Request;
use App\Models\AgencyProfile;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ResponseController extends Controller
{
    public function __construct()
    {
        $this->middleware(
            'permission:agency-list|agency-create|agency-edit|agency-delete',
            ['only' => ['index', 'store', 'responses']]
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
        return view('agency.responseoverview.index');
    }

    //get all response data
    public function responses()
    {
        $profile = AgencyProfile::where('user_id', Auth::user()->id)->first();
        if (!$profile) {
            return response()->json(['error' => 'Unauthorized data'], 422);
        }
        $data = Response::where('profile_id', $profile->id)
            ->orderBy('id', 'DESC')
            ->get();

        return response()->json($data);
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
            'file' => 'required|max:5000|file|mimes:xls,xlsx',
            'start_date'=>'required|date',
            'end_date'=>'required|date|after:start_date',
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
            $data = new Response();
            $file = $request->file('file');
            $path = storage_path() . '/app/xlsx/uploads/';
            if (!File::exists($path)) {
                Storage::makeDirectory('/xlsx/uploads/');
            }
            $filename = Str::random(15) . '_' . $file->getClientOriginalName();
            $file->move($path, $filename);
            $data->start_date = $request->start_date;
            $data->end_date = $request->end_date;
            $data->file = $filename;
            $data->profile_id = $profile->id;
            $data->save();
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
        try {
            $user_id = Auth::user()->id;
            //Find user profile
            $profile = AgencyProfile::where('user_id', $user_id)->first();
            if (!$profile) {
                return response()->json([
                    'message' => 'Please fille profile first',
                ]);
            }
            $data = Response::where('profile_id', $profile->id)->find($id);

            return response()->json($data);
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
    public function update(Request $request, $id)
    {
        $request->validate([
            'file' => 'nullable|max:5000|file|mimes:xls,xlsx',
            'start_date'=>'required|date',
            'end_date'=>'required|date',
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
            $data = Response::where('profile_id', $profile->id)->find($id);
            if ($request->file('file')) {
                $file = $request->file('file');
                $path = storage_path() . '/app/xlsx/uploads/';
                if (!File::exists($path)) {
                    Storage::makeDirectory('/xlsx/uploads/');
                }
                //delete old file
                File::delete($path.$data->file);
                $filename = Str::random(15) . '_' . $file->getClientOriginalName();
                $file->move($path, $filename);
                $data->file = $filename;
            }
            $data->start_date = $request->start_date;
            $data->end_date = $request->end_date;
            $data->profile_id = $profile->id;
            $data->save();

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
            $data = Response::where('profile_id', $profile->id)->find($id);

            $path = storage_path() . '/app/xlsx/uploads/';
            File::delete($path.$data->file);

            $data->delete();

            return response()->json($data);
        } catch (\Exception $e) {
            return $e->getMessage();
        }
    }
}
