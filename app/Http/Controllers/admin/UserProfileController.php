<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\PasswordChangeRequest;
use Illuminate\Support\Facades\Hash;

//Each user profile

class UserProfileController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:profile-list', [
            'only' => ['show', 'edit', 'update', 'password'],
        ]);
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
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
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $user = User::find($id);
        if($user->id !== Auth::user()->id){
            return redirect()->back();
        }
        return response()->json($user);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        $user = User::find($id);
        if($user->id !== Auth::user()->id){
            return redirect()->back();
        }
        return view('adminpanel.user.edit', compact('user'));
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
            'name' => 'required|string|max:100|min:2',
            'email' => 'required|email|max:100|unique:users,email,' . $id,
        ]);

        try {
            $user = User::find($id);
            if($user->id !== Auth::user()->id){
                return redirect()->back();
            }
            $user->name = $request->name;
            $user->email = $request->email;
            $user->save();

            return redirect()
                ->back()
                ->with('success', 'Record updated successfully!');
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

    public function password()
    {
        $user = Auth::user();
        return view('adminpanel.user.password', compact('user'));
    }

    public function changepassword(PasswordChangeRequest $request)
    {
        try {
            if (Auth::check()) {
                $user = Auth::user();
                $request_data = $request->all();
                $current_pwd = $user->password;
                if (
                    Hash::check($request_data['current_password'], $current_pwd)
                ) {
                    $user->password = Hash::make($request_data['new_password']);
                    $user->save();
                    return redirect()
                        ->back()
                        ->with('success', 'Password changed successfully!');
                } else {
                    return redirect()
                        ->back()
                        ->with('current_password', 'Current password don\'t match!', 422);
                }
            } else {
                return redirect()->back();
            }
        } catch (\Exception $e) {
            return $e->getMessage();
        }
    }
}
