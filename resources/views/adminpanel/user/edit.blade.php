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
                    <form method="POST" action="{{ route('user.update', $user->id) }}">
                        @csrf
                        {{method_field('PUT')}}

                        <div class="form-group mb-3">
                            <label for="name" class="col-form-label text-md-end">{{ __('Name') }}</label>

                                <input id="name" type="text" class="form-control @error('name') is-invalid @enderror" name="name" value="{{ $user->name }}" required autocomplete="name" autofocus>

                                @error('name')
                                <span class="invalid-feedback" role="alert">
                                    <strong>{{ $message }}</strong>
                                </span>
                                @enderror
                        </div>

                        <div class="form-group mb-3">
                            <label for="email" class="col-form-label text-md-end">{{ __('Email address') }}</label>

                                <input id="email" type="email" class="form-control @error('email') is-invalid @enderror" name="email" value="{{ $user->email }}" required autocomplete="email">

                                @error('email')
                                <span class="invalid-feedback" role="alert">
                                    <strong>{{ $message }}</strong>
                                </span>
                                @enderror
                        </div>

                        <div class="form-group">
                            <div>
                                <button type="submit" class="btn btn-primary">
                                    {{ __('Update')  }} <i class="bi bi-cloud-arrow-up"></i>
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
