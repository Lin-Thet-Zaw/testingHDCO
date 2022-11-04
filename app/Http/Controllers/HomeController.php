<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Travel;
use App\Models\AgencyProfile;
use App\Models\User;

class HomeController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('permission:profile-list', [
            'only' => ['index', 'profiles', 'show', 'showdata'],
        ]);
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function index()
    {
        $pending = Travel::where('allow', 0)->count();
        $allowed = Travel::where('allow', 2)->count();
        $agencies = AgencyProfile::count();
        $users = User::count();
        return view('home', compact('pending', 'allowed', 'agencies', 'users'));
    }
}
