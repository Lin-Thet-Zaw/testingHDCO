<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\TownController;
use App\Http\Controllers\CommunityController;
use App\Http\Controllers\admin\NationalityController;
use App\Http\Controllers\admin\AgencyTypeController;
use App\Http\Controllers\agency\AgencyProfileController;
use App\Http\Controllers\agency\TravelController;
use App\Http\Controllers\agency\EmployeeController;
use App\Http\Controllers\agency\EmployeeTravelController;
use App\Http\Controllers\agency\SettingController as AgencySettingController;

use App\Http\Controllers\admin\AgencyProfileController as ProfileController;
use App\Http\Controllers\admin\LocationController;
use App\Http\Controllers\admin\TripController;
use App\Http\Controllers\agency\BudgetController;
use App\Http\Controllers\agency\ContactPersonController;
use App\Http\Controllers\agency\DonorController;
use App\Http\Controllers\agency\OfficeController;
use App\Http\Controllers\agency\ResponseController;
use App\Http\Controllers\agency\StaffController;
use Spatie\Permission\Contracts\Role;
use App\Http\Controllers\admin\UserProfileController;
use App\Http\Controllers\agency\RecentTravellerController;
use App\Http\Controllers\admin\EmailController;

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\ForgotPasswordController;
use App\Http\Controllers\Auth\ResetPasswordController;
use App\Http\Controllers\Auth\VerificationController;

use App\Http\Controllers\PDFController;
use App\Mail\TripMail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Auth;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    if (Auth::user()) {
        $role = Auth::user()->roles->pluck('name')[0];
        switch ($role) {
            case 'Admin':
            case 'Editor':
              return redirect('/admin/home');
              break;
            default:
              return redirect('/agency/profile'); 
            break;
        }
    }else{
        return view('welcome');
    }
    
})->name('welcome');

Route::post('/login', [LoginController::class, 'login'])->name('login');
Route::get('/login', function () {
    return redirect()->back();
});

Route::post('/logout', [LoginController::class, 'logout'])->name('logout');

// Password Reset Routes...
Route::get('password/reset', [
    ForgotPasswordController::class,
    'showLinkRequestForm',
])->name('password.request');
Route::post('password/email', [
    ForgotPasswordController::class,
    'sendResetLinkEmail',
])->name('password.email');

Route::get('password/reset/{token}', [ResetPasswordController::class, 'showResetForm'])->name('password.reset');

Route::post('password/reset', [ResetPasswordController::class, 'reset'])->name(
    'password.update'
);

// Email Verification Routes...
Route::get('email/verify', [VerificationController::class, 'show'])->name(
    'verification.notice'
);
Route::get('email/verify/{id}/{hash}', [
    VerificationController::class,
    'verify',
])->name('verification.verify');
Route::post('email/resend', [VerificationController::class, 'resend'])->name(
    'verification.resend'
);

//Admin Panel
Route::prefix('/admin')
    ->middleware('auth')
    ->group(function () {
        Route::get('/users', [UserController::class, 'index'])->name('users'); //show all users
        Route::get('/users/create', [UserController::class, 'create'])->name(
            'users.create'
        );
        Route::post('/users/create', [UserController::class, 'store'])->name(
            'users.store'
        );
        Route::get('/users/{id}/edit', [UserController::class, 'edit'])->name(
            'edituser'
        ); // edit user
        Route::post('/users/{id}/edit', [
            UserController::class,
            'update',
        ])->name('updateuser'); // update user

        Route::get('/users/destroy/{id}', [UserController::class, 'destroy'])->name('destroyuser');

        //User profile and change password
        Route::get('/changepassword', [
            UserProfileController::class,
            'password',
        ]);
        Route::post('/changepassword', [
            UserProfileController::class,
            'changepassword',
        ])->name('changeadminpwd');
        Route::resource('/user', UserProfileController::class);

        Route::get('/home', [
            App\Http\Controllers\HomeController::class,
            'index',
        ])->name('home');

        //Setting
        Route::get('/setting', [SettingController::class, 'index'])->name(
            'setting'
        ); // Setting Controller

        //Town Controller
        Route::resource('/towns', TownController::class);

        //Community Resource
        Route::resource('/community', CommunityController::class);

        //Nationality resource
        Route::resource('/nationality', NationalityController::class);

        //Agency Type

        Route::resource('/agencytype', AgencyTypeController::class);

        //Location type
        Route::resource('/locations', LocationController::class);

        //mailable users
        Route::resource('/mailableusers', EmailController::class);

        //User Role
        Route::resource('roles', RoleController::class);

        //Agency profile
        Route::get('/profiles', [ProfileController::class, 'index']);
        Route::get('/profile-lists', [ProfileController::class, 'profiles']);
        Route::get('/profilesdata/{id}', [
            ProfileController::class,
            'showdata',
        ]);
        Route::get('/profiles/{id}', [ProfileController::class, 'show']);
        //Download excel file of agency
        Route::get('/profile/filedownload/{file}', [
            ProfileController::class,
            'downloadfile',
        ]);

        Route::post('/profile/allowtriprequest/{id}', [ProfileController::class, 'allowtriprequest']);

        //Trips
        Route::get('/trips/export/{townid}', [TripController::class, 'export']);
        Route::get('/trips', [TripController::class, 'index']);
        Route::get('/trips/{id}', [TripController::class, 'show']);
        Route::get('/tripdetail/{id}', [TripController::class, 'tripdetail']);
        Route::get('/alltrips/{id?}', [TripController::class, 'trips']);
        Route::post('/trips/{id}', [TripController::class, 'store']);
        Route::put('/trips/{id}', [TripController::class, 'update']);
        Route::get('/allowed/trips', [TripController::class, 'allowedtrips']);
        Route::put('/trips/{id}/updateaddress', [
            TripController::class,
            'updateaddress',
        ]);
       
    });

//Agency Panel
Route::prefix('/agency')
    ->middleware('auth')
    ->group(function () {
        //Agency profile
        Route::resource('/profile', AgencyProfileController::class);

        //Contact person
        Route::get('/contacts', [ContactPersonController::class, 'contacts']);
        Route::resource('/contactperson', ContactPersonController::class);

        //staff with nationality of each agency
        Route::resource('/staffs', StaffController::class);

        //Budget
        Route::get('/annualbudgets', [BudgetController::class, 'budgets']);
        Route::resource('/budgets', BudgetController::class);

        //Travel Request
        Route::get('/travel/lists', [
            TravelController::class,
            'travellist',
        ])->name('travel-list');
        Route::resource('/travel', TravelController::class);

        //Employee
        Route::get('/travellers/list/{status?}', [
            EmployeeController::class,
            'employees',
        ])->name('travellers_lists');
        Route::resource('/travellers', EmployeeController::class);

        Route::get('/responses', [ResponseController::class, 'responses']);
        //response overview
        Route::resource('/responseoverview', ResponseController::class);

        //Add employee for travel
        Route::get('/employeetravel/{id}', [
            EmployeeTravelController::class,
            'index',
        ])->name('employeetravel.index');
        Route::post('/employeetravel/{id}', [
            EmployeeTravelController::class,
            'store',
        ])->name('employeetravel.store');

        //Agency setting to change email, username and password
        Route::get('/setting', [AgencySettingController::class, 'index'])->name(
            'agencysetting.index'
        );
        Route::get('/getuser', [AgencySettingController::class, 'user'])->name(
            'agencysetting.user'
        );
        Route::post('/changepassword', [
            AgencySettingController::class,
            'changepassword',
        ])->name('agencysetting.changepassword');

        Route::post('/updateuser/{id}', [
            AgencySettingController::class,
            'updateuser',
        ])->name('agencysetting.updateuser');

        //donors
        Route::get('/getdonors', [DonorController::class, 'donors']);
        Route::resource('/donors', DonorController::class);

        //offices
        Route::get('/getoffices', [OfficeController::class, 'offices']);
        Route::resource('/offices', OfficeController::class);
    });

    Route::get('/webpdf/{id}', [TripController::class, 'tripview']);
    Route::get('/viewpdf/{id}', [TripController::class, 'viewpdf']);