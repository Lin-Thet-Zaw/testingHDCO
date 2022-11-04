<?php

namespace App\Http\Controllers\agency;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\PasswordChangeRequest;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class SettingController extends Controller
{
    public function __construct()
    {
        $this->middleware(
            'permission:agency-list|agency-create|agency-edit|agency-delete',
            [
                'only' => [
                    'index',
                    'store',
                    'user',
                    'updateuser',
                    'changepassword',
                ],
            ]
        );
        $this->middleware('permission:agency-create', [
            'only' => ['create', 'store'],
        ]);
        $this->middleware('permission:agency-edit', [
            'only' => ['edit', 'update'],
        ]);
        $this->middleware('permission:agency-delete', ['only' => ['destroy']]);
    }
    //function to show setting view
    public function index()
    {
        return view('agency.setting');
    }

    //get user
    public function user()
    {
        try {
            $user = Auth::user();

            return response()->json($user);
        } catch (\Exception $e) {
            return $e->getMessage();
        }
    }

    //change user detail
    public function updateuser(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:100|min:2',
            'email' => 'required|email|max:100|unique:users,email,' . $id,
        ]);

        try {
            $user = User::find($id);
            if (!$user) {
                return response()->json(['error' => 'User no found'], 422);
            }
            $user->name = $request->name;
            $user->email = $request->email;
            $user->save();

            return response()->json([
                'success' => 'User updated successfully!',
            ]);
        } catch (\Exception $e) {
            return $e->getMessage();
        }
    }

    //change password
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
                    $id = $user->id;
                    $user = User::find($id);
                    $user->password = Hash::make($request_data['new_password']);
                    $user->save();
                    return response()->json(
                        [
                            'success' => 'Password changed successfully!',
                        ],
                        200
                    );
                } else {
                    return response()->json(
                        [
                            'errors' => [
                                'current_password' =>
                                    'Current password don\'t match',
                            ],
                        ],
                        422
                    );
                }
            } else {
                return redirect()->back();
            }
        } catch (\Exception $e) {
            return $e->getMessage();
        }
    }
}
