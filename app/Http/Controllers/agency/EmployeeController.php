<?php

namespace App\Http\Controllers\agency;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Employee;
use App\Http\Requests\EmployeeRequest;
use App\Models\AgencyProfile;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Facades\Image;
use Illuminate\Support\Facades\DB;

class EmployeeController extends Controller
{
    public function __construct()
    {
        $this->middleware(
            'permission:agency-list|agency-create|agency-edit|agency-delete',
            ['only' => ['index', 'store', 'employees']]
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
        return view('agency.employee.index');
    }

    //Get list of employee to show
    public function employees($status = 1)
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
            $employees = Employee::with('nationality:id,name')
                ->where('agencyprofile_id', $profile->id)
                ->where('status', $status)
                ->orderBy('id', 'DESC')
                ->paginate(6);
            return response()->json($employees);
        } catch (\Exception $e) {
            $e->getMessage();
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
    public function store(EmployeeRequest $request)
    {
        try {
            //First check profile already exist
            $profile = AgencyProfile::where(
                'user_id',
                Auth::user()->id
            )->first();

            if (!$profile) {
                return response()->json(
                    [
                        'errors' => [
                            'profile_error' => 'Please fill profile first',
                        ],
                    ],
                    422
                );
            }

            //check file and resize
            if ($request->hasFile('frontid')) {
                $file_frontid = $request->file('frontid');
                $type = $request->file('frontid')->extension();
                $frontidimage = 'data:image/'.$type.';base64,'.base64_encode(file_get_contents($request->file('frontid')));
            }

            //check file and resize
            if ($request->hasFile('backid')) {
                $file_backid = $request->file('backid');
                $type = $request->file('backid')->extension();
                $backidimage = 'data:image/'.$type.';base64,'.base64_encode(file_get_contents($request->file('backid')));
            }

            //check file and resize
            if ($request->hasFile('passport_photo')) {
                $file_passport = $request->file('passport_photo');
                $type = $request->file('passport_photo')->extension();
                $passportphoto = 'data:image/'.$type.';base64,'.base64_encode(file_get_contents($request->file('passport_photo')));
            }
            $employee = new Employee();
            $employee->name = $request->name;
            $employee->nationality_id = $request->nationality;
            $employee->position = $request->position;
            $employee->sex = $request->sex;
            $employee->id_front = $frontidimage;
            $employee->id_back = $backidimage;
            $employee->photo = $passportphoto;
            $employee->agencyprofile_id = $profile->id;
            $employee->status = $request->status;

            $employee->save();

            $employee->travel()->attach($request->travel_id); // save into database for travel

            $savedEmployee = Employee::with('nationality:id,name')->find(
                $employee->id
            );

            return response()->json($savedEmployee);
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
            //get profile
            $profile = AgencyProfile::where(
                'user_id',
                Auth::user()->id
            )->first();
            //if profile no found
            if (!$profile) {
                return response()->json([
                    'error' => 'Please fill profile first',
                ]);
            }
            $employee = Employee::with('nationality')->find($id);
            if ($employee->agencyprofile_id !== $profile->id) {
                return response()->json([
                    'error' => 'Unauthorized for this person',
                ]);
            }
            return response()->json($employee);
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
    public function update(EmployeeRequest $request, $id)
    {
        try {
            //First check profile already exist
            $profile = AgencyProfile::where(
                'user_id',
                Auth::user()->id
            )->first();

            if (!$profile) {
                return response()->json([
                    'message' => 'Please fill profile first',
                ]);
            }
            $employee = Employee::where('agencyprofile_id', $profile->id)->find(
                $id
            );
            if (!$employee) {
                return response()->json(['error' => 'Unauthorized employee']);
            }
            //check file and resize
            if ($request->hasFile('frontid')) {
                $type = $request->file('frontid')->extension();
                $frontidimage = 'data:image/'.$type.';base64,'.base64_encode(file_get_contents($request->file('frontid')));
                $employee->id_front = $frontidimage;
            }

            //check file and resize
            if ($request->hasFile('backid')) {
                $type = $request->file('backid')->extension();
                $backidimage = 'data:image/'.$type.';base64,'.base64_encode(file_get_contents($request->file('backid')));
                $employee->id_back = $backidimage;
            }

            //check file and resize
            if ($request->hasFile('passport_photo')) {
                $type = $request->file('passport_photo')->extension();
                $passportphoto = 'data:image/'.$type.';base64,'.base64_encode(file_get_contents($request->file('passport_photo')));
                $employee->photo = $passportphoto;
            }

            $employee->name = $request->name;
            $employee->nationality_id = $request->nationality;
            $employee->position = $request->position;
            $employee->sex = $request->sex;

            $employee->save();

            $savedEmployee = Employee::with('nationality:id,name')->find(
                $employee->id
            );

            return response()->json($savedEmployee);
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
