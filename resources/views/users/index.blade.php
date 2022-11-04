@extends('layouts.app')

@section('content')
<div class="container">
    <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
            <li class="breadcrumb-item"><a href="/admin/home">Dashboard</a></li>
            <li class="breadcrumb-item active" aria-current="page">Users</li>
        </ol>
    </nav>
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card">

                <div class="card-body">
                    @if (session('status'))
                    <div class="alert alert-success alert-dismissible fade show" role="alert">
                        <strong>Success!</strong> {{ session('status') }}
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                      </div>
                    @endif

                    <!-- users list table -->
                    <div>
                        <div class="d-flex flex-row-reverse"><a href="{{ route('users.create') }}" class="btn btn-primary">Add New User</a></div>
                        <!-- start table -->
                        <table class="table table-hover">
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <!-- start tbody -->
                            <tbody>
                                @foreach($users as $key=>$user)
                                <tr>
                                    <td>{{ ++$key }}</td>
                                    <td>{{ $user->name }}</td>
                                    <td>{{ $user->email }}</td>
                                    <td>{{ $user->getRoleNames()->count() > 0 ? $user->getRoleNames()[0]:null }}</td>
                                    <td>
                                        <a href=" {{ route('edituser', $user->id) }} ">Edit</a>
                                        <a href="{{ route('destroyuser', $user->id) }}" onclick="return confirm('Are your sure?')">Delete</a>
                                    </td>
                                </tr>
                                @endforeach
                            </tbody>
                            <!-- end tbody -->
                        </table>
                        <!-- end table -->
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
