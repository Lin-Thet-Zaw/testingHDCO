<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ ('Humanitarian and Development Coordination Office') }}</title>

    <!-- Scripts -->
    <script src="{{ secure_url('js/app.js') }}" defer></script>

    <!-- Fonts -->
    <link rel="dns-prefetch" href="//fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css?family=Nunito" rel="stylesheet">

    <!-- Styles -->
    <link href="{{ secure_url('css/app.css') }}" rel="stylesheet">
    <link rel="shortcut icon" type="image/png" href="{{ secure_url('/logos/hdco.png') }}">

    <!-- Fontawesome -->

    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.9.1/font/bootstrap-icons.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootswatch@4.5.2/dist/darkly/bootstrap.min.css" integrity="sha384-nNK9n28pDUDDgIiIqZ/MiyO3F4/9vsMtReZK39klb/MtkZI3/LtjSjlmyVPS3KdN" crossorigin="anonymous">
    

</head>
<body>
    <div id="app">
        <nav class="navbar navbar-expand-md navbar-dark bg-primary shadow-sm">
            <div class="container">
                @role('Admin|Editor')
                <a class="navbar-brand" href="{{ url('/admin/home') }}">
                    <img src="{{ secure_url('/logos/hdco.png')}}" alt="HDCO" width="40" height="40" style="background-color: white; border-radius: 50%">
                </a>
                @else
                    @auth
                    <a class="navbar-brand" href="{{ url('/agency/profile') }}">
                        <img src="{{ secure_url('/logos/hdco.png')}}" alt="HDCO" width="40" height="40" style="background-color: white; border-radius: 50%">
                    </a>
                    @endauth
                @endrole

                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="{{ __('Toggle navigation') }}">
                    <span class="navbar-toggler-icon"></span>
                </button>

                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <!-- Left Side Of Navbar -->
                    <ul class="navbar-nav me-auto">
                        @can('agency-list')
                        <li class="nav-item">
                            <a class="nav-link active" aria-current="page" href="{{url('/agency/profile')}}">
                                <div class='text-center'>
                                    <i class="bi bi-info-circle"></i>
                                    <br />
                                    <small>Profile</small>
                                </div>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link active" aria-current="page" href="{{url('/agency/contactperson')}}">
                                <div class='text-center'>
                                    <i class="bi bi-person"></i> <br /><small>Contact Person</small>
                                </div>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link active" aria-current="page" href="{{url('/agency/budgets')}}">
                                <div class='text-center'>
                                    <i class="bi bi-coin"></i><br /><small>Annual Budget</small>
                                </div>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link active" aria-current="page" href="{{url('/agency/donors')}}">
                                <div class='text-center'>
                                    <i class="bi bi-heart"></i><br /><small>Donors</small>
                                </div>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link active" aria-current="page" href="{{url('/agency/offices')}}">
                                <div class='text-center'>
                                    <i class="bi bi-house-door"></i><br /><small>Sub-offices</small>
                                </div>
                            </a>
                        </li>
      
                        <li class="nav-item">
                            <a class="nav-link active" aria-current="page" href="{{url('/agency/travel')}}">
                                <div class='text-center'>
                                    <i class="bi bi-pin-map"></i><br /><small>Trips</small>
                                </div>
                            </a>
                        </li>
                 
                        <li class="nav-item">
                            <a class="nav-link active" aria-current="page" href="{{url('/agency/responseoverview')}}">
                                <div class='text-center'>
                                    <i class="bi bi-file-earmark-spreadsheet"></i><br /><small>Projects Overview</small>
                                </div>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link active" aria-current="page" href="{{url('/agency/setting')}}">
                                <div class='text-center'>
                                    <i class="bi bi-gear"></i><br /><small>Setting</small>
                                </div>
                            </a>
                        </li>
                        @endcan
                    </ul>

                    <!-- Right Side Of Navbar -->
                    <ul class="navbar-nav ms-auto">
                        <!-- Authentication Links -->
                        @guest
                        @if (Route::has('login'))
                        <li class="nav-item">
                            <a class="nav-link" href="{{ route('welcome') }}">{{ __('Login') }}</a>
                        </li>
                        @endif

                        @if (Route::has('register'))
                        <li class="nav-item">
                            <a class="nav-link" href="{{ route('register') }}">{{ __('Register') }}</a>
                        </li>
                        @endif
                        @else
                        <li class="nav-item dropdown">
                            <a id="navbarDropdown" class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" v-pre>
                                <i class="bi bi-person-circle"></i> {{ Auth::user()->name }}
                            </a>

                            <div class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                                @can('profile-list')
                                <a class="dropdown-item" href="{{ route('user.edit', Auth::user()->id) }}">
                                    <i class="bi bi-person"></i> {{ __('Profile') }}
                                </a>
                                @endcan
                                @can('role-list')
                                <a class="dropdown-item" href="{{ route('users.create') }}">
                                    <i class="bi bi-person-plus-fill"></i> {{ __('Register') }}
                                </a>
                                @endcan
                                @can('agency-list')
                                <a class="dropdown-item" href="{{ url('/agency/profile') }}">
                                    <i class="bi bi-person"></i> {{ __('Profile') }}
                                </a>
                                <a class="dropdown-item" href="{{ route('agencysetting.index')}}">
                                    <i class="bi bi-gear"></i> {{ __('Setting') }}
                                </a>
                                @endcan
                                <a class="dropdown-item" href="{{ route('logout') }}" onclick="event.preventDefault();
                                                     document.getElementById('logout-form').submit();">
                                    <i class="bi bi-box-arrow-left"></i> {{ __('Logout') }}
                                </a>

                                <form id="logout-form" action="{{ route('logout') }}" method="POST" class="d-none">
                                    @csrf
                                </form>
                            </div>
                        </li>
                        @endguest
                    </ul>
                </div>
            </div>
        </nav>

        <main class="py-4">
            @yield('content')
        </main>
    </div>
</body>
</html>
