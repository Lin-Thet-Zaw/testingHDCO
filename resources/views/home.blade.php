@extends('layouts.app')

@section('content')
<div class="container">

    <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
            <li class="breadcrumb-item active" aria-current="page">Dashboard</li>
        </ol>
    </nav>

    <div class="row justify-content-center mt-5">
        {{-- col start --}}
        <div class='col-md-4'>
            <div class='card'>
                <a href='/admin/trips' class='anchorlink'>
                    <div class='card-body menu-card'>
                        <img src='{{asset('/logos/request_trip.png')}}' width='100' />
                        <p>Trip Request <span class="badge rounded-pill bg-danger">{{$pending}}</span></p>
                    </div>
                </a>
            </div>
        </div>
        {{-- end col --}}

        {{-- col start --}}
        <div class='col-md-4'>
            <div class='card'>
                <a href='/admin/allowed/trips' class='anchorlink'>
                    <div class='card-body menu-card'>
                        <img src='{{asset('/logos/approved.png')}}' width='100' />
                        <p>Trip Approved <span class="badge rounded-pill bg-success">{{$allowed}}</span></p>
                    </div>
                </a>
            </div>
        </div>
        {{-- end col --}}

        {{-- col start --}}
        <div class='col-md-4'>
            <div class='card'>
                <a href='/admin/profiles' class='anchorlink'>
                    <div class='card-body menu-card'>
                        <img src='{{asset('/logos/users.png')}}' width='100' />
                        <p>Agency Profiles <span class="badge rounded-pill bg-info">{{$agencies}}</span></p>
                    </div>
                </a>
            </div>
        </div>
        {{-- end col --}}
    </div>
    {{-- end row --}}

    {{-- start row --}}
    <div class='row mt-5 justify-content-center'>


        {{-- col start --}}
        @can('role-list')
        {{-- col start --}}
        <div class='col-md-4'>
            <div class='card'>
                <a href='/admin/roles' class='anchorlink'>
                    <div class='card-body menu-card'>
                        <img src='{{asset('/logos/roles.png')}}' width='100' />
                        <p>Roles </p>
                    </div>
                </a>
            </div>
        </div>
        {{-- end col --}}

        <div class='col-md-4'>
            <div class='card'>
                <a href='/admin/users' class='anchorlink'>
                    <div class='card-body menu-card'>
                        <img src='{{asset('/logos/users.png')}}' width='100' />
                        <p>Users <span class="badge rounded-pill bg-info">{{$users}}</span></p>
                    </div>
                </a>
            </div>
        </div>

        {{-- col start --}}
        <div class='col-md-4'>
            <div class='card'>
                <a href='/admin/setting' class='anchorlink'>
                    <div class='card-body menu-card'>
                        <img src='{{asset('/logos/setting.png')}}' width='100' />
                        <p>Setting</p>
                    </div>
                </a>
            </div>
        </div>
        {{-- end col --}}


        @endcan
        {{-- end col --}}
    </div>
    {{-- end row --}}

</div>
@endsection
