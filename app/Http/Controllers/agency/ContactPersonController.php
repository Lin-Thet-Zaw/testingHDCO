<?php

namespace App\Http\Controllers\agency;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ContactPerson;
use App\Models\AgencyProfile;
use Illuminate\Support\Facades\Auth;
use Intervention\Image\Facades\Image;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use App\Http\Requests\ContactPersonRequest;

class ContactPersonController extends Controller
{
    public function __construct()
    {
        $this->middleware(
            'permission:agency-list|agency-create|agency-edit|agency-delete',
            ['only' => ['index', 'store', 'contacts']]
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
        return view('agency.profile.contactperson');
    }

    //get contact person
    public function contacts()
    {
        //First check profile already exist
        $profile = AgencyProfile::where('user_id', Auth::user()->id)->first();

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
        $contacts = ContactPerson::where('profile_id', $profile->id)
            ->orderBy('id', 'DESC')
            ->get();
        return response()->json($contacts);
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
    public function store(ContactPersonRequest $request)
    {
        try {
            //First check profile already exist
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

            //Make storage path
            $path = storage_path() . '/app/public/uploads/passport/';
            if (!File::exists($path)) {
                Storage::makeDirectory('/public/uploads/passport/');
            }

            //check file and resize
            if ($request->hasFile('frontid')) {
                $file_frontid = $request->file('frontid');
                $frontid =
                    time() . '_' . $file_frontid->getClientOriginalName();
                $image_resize = Image::make($file_frontid->getRealPath());
                $image_resize->resize(500, null, function ($constraint) {
                    $constraint->aspectRatio();
                });
                $image_resize->save($path . $frontid);
            }

            //check file and resize
            if ($request->hasFile('backid')) {
                $file_backid = $request->file('backid');
                $backid = time() . '_' . $file_backid->getClientOriginalName();
                $image_resize = Image::make($file_backid->getRealPath());
                $image_resize->resize(500, null, function ($constraint) {
                    $constraint->aspectRatio();
                });
                $image_resize->save($path . $backid);
            }

            //check file and resize
            if ($request->hasFile('passport_photo')) {
                $file_passport = $request->file('passport_photo');
                $photo = time() . '_' . $file_passport->getClientOriginalName();
                $image_resize = Image::make($file_passport->getRealPath());
                $image_resize->resize(500, null, function ($constraint) {
                    $constraint->aspectRatio();
                });
                $image_resize->save($path . $photo);
            }
            $contact = new ContactPerson();
            $contact->name = $request->name;
            $contact->nationality_id = $request->nationality;
            $contact->phone_number = $request->phone_number;
            $contact->email = $request->email;
            $contact->position = $request->position;
            $contact->sex = $request->sex;
            $contact->id_front = $frontid;
            $contact->id_back = $backid;
            $contact->passport = $photo;
            $contact->profile_id = $profile->id;

            $contact->save();

            return response()->json($contact);
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
                return response()->json(
                    [
                        'errors' => [
                            'profile_error' => 'Please fill profile first',
                        ],
                    ],
                    422
                );
            }

            $contact = ContactPerson::with('nationality')
                ->where('profile_id', $profile->id)
                ->find($id);

            return response()->json($contact);
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
    public function update(ContactPersonRequest $request, $id)
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

            $contact = ContactPerson::find($id);

            $path = storage_path() . '/app/public/uploads/passport/';
            //check file and resize
            if ($request->hasFile('frontid')) {
                //delete existing file
                File::delete($path . $contact->id_front);
                $file_frontid = $request->file('frontid');
                $frontid =
                    time() . '_' . $file_frontid->getClientOriginalName();
                $image_resize = Image::make($file_frontid->getRealPath());
                $image_resize->resize(500, null, function ($constraint) {
                    $constraint->aspectRatio();
                });
                $image_resize->save($path . $frontid);
                $contact->id_front = $frontid;
            }

            //check file and resize
            if ($request->hasFile('backid')) {
                //delete existing file
                File::delete($path . $contact->id_back);
                $file_backid = $request->file('backid');
                $backid = time() . '_' . $file_backid->getClientOriginalName();
                $image_resize = Image::make($file_backid->getRealPath());
                $image_resize->resize(500, null, function ($constraint) {
                    $constraint->aspectRatio();
                });
                $image_resize->save($path . $backid);
                $contact->id_back = $backid;
            }

            //check file and resize
            if ($request->hasFile('passport')) {
                //delete ecisting file
                File::delete($path . $contact->passport);
                $file_passport = $request->file('passport');
                $photo = time() . '_' . $file_passport->getClientOriginalName();
                $image_resize = Image::make($file_passport->getRealPath());
                $image_resize->resize(500, null, function ($constraint) {
                    $constraint->aspectRatio();
                });
                $image_resize->save($path . $photo);
                $contact->passport = $photo;
            }

            $contact->name = $request->name;
            $contact->nationality_id = $request->nationality;
            $contact->phone_number = $request->phone_number;
            $contact->email = $request->email;
            $contact->position = $request->position;
            $contact->sex = $request->sex;

            $contact->save();

            return response()->json($contact);
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
            $contact = ContactPerson::where('profile_id', $profile->id)->find(
                $id
            );
            if (!$contact) {
                return response()->json(['err' => 'Profile no found'], 422);
            }
            $path = storage_path() . '/app/public/uploads/passport/';
            File::delete($path . $contact->id_front);
            File::delete($path . $contact->id_back);
            File::delete($path . $contact->passport);
            $contact->delete();

            return response()->json($contact);
        } catch (\Exception $e) {
            return $e->getMessage();
        }
    }
}
