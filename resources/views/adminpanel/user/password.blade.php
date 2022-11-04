@extends('layouts.app')

@section('content')
<div class="container">
    <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><a href="/admin/home">Dashboard</a></li>
          <li class="breadcrumb-item active" aria-current="page">Edit Profile</li>
        </ol>
      </nav>
    <div class="row justify-content-center">
        <div class='col-md-2'>

            <p><i class="bi bi-person-circle"></i> {{$user->name}}</p>
            <p><i class="bi bi-envelope"></i> {{$user->email}}</p>
            <p><i class="bi bi-person-rolodex"></i> {{$user->getRoleNames()[0]}}</p>
            <p><i class="bi bi-key"></i> <a href='/admin/changepassword'>Change password</a></p>
        </div>
        <div class="col-md-6">
            <div class="card">

                <div class="card-body">
                    @if(session('success'))
                        <div class="alert alert-success alert-dismissible fade show" role="alert">
                        <strong>Success!</strong> {{session('success')}}
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                        </div>
                    @endif
                    <form method="POST" action="{{ route('changeadminpwd') }}">
                        @csrf

                        <div class="row mb-3">
                            <label for="password" class="col-form-label">{{ __('Current password') }}</label>
                            <div>
                                <input id="pwd" type="password" class="form-control @error('current_password') is-invalid @enderror" name="current_password" required placeholder='Enter current password'>

                                @error('current_password')
                                <span class="invalid-feedback" role="alert">
                                    <strong>{{ $message }}</strong>
                                </span>
                                @enderror
                                @if(session('current_password'))
                                    <p class="text-danger">{{ session('current_password') }}</p>
                                @endif
                            </div>
                        </div>

                        <div class="row mb-3">
                            <label for="password" class="col-form-label">{{ __('New password') }}</label>
                            <div>
                                <input id="pwd" type="password" class="form-control @error('new_password') is-invalid @enderror" name="new_password" required placeholder='Enter new password'>

                                @error('new_password')
                                <span class="invalid-feedback" role="alert">
                                    <strong>{{ $message }}</strong>
                                </span>
                                @enderror
                            </div>
                        </div>

                        <div class="row mb-3">
                            <label for="password" class="col-form-label">{{ __('Confirm password') }}</label>
                            <div>
                                <input id="pwd" type="password" class="form-control" name="new_password_confirmation" required placeholder='Enter confirm password'>
                            </div>
                        </div>

                        <div class="row mb-0">
                            <div>
                                <button type="submit" class="btn btn-primary">
                                    {{ __('Change password') }}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
