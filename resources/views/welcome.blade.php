<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>Humanitarian and Development Coordination Office</title>
    <!-- Styles -->
    <link href="{{ secure_url('css/app.css') }}" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.9.1/font/bootstrap-icons.css">
    <link rel="stylesheet" href="{{ {{ secure_url('darkly-bootstrap.css') }}" integrity="sha384-nNK9n28pDUDDgIiIqZ/MiyO3F4/9vsMtReZK39klb/MtkZI3/LtjSjlmyVPS3KdN" crossorigin="anonymous">
    <link rel="shortcut icon" type="image/png" href="{{secure_url('/logos/hdco.png')}}">

    <!-- Scripts -->
    <script src="{{ secure_url('js/app.js') }}" defer></script>
    <style>
        .logincontainer{
            background-color: #ffffff;
            padding:80px 0px;
            margin-top: 50px;
            border-radius: 20px;
            min-height: 800px;
        }
        .custom-form-control{
            border: none;
            border-bottom: 1px solid gray;
            border-radius: 0px;
            width: 100%;
            padding: 10px;
        }
        .icon{
            background-color: transparent;
            border: none;
        }
        .footer{
            height: 100px;
            margin-top: 20px;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="row justify-content-center logincontainer">
            <!-- start col -->
            <div class="col-md-6">
                <img src="{{secure_url('/logos/working.png')}}" alt="HDCO" width="100%">
            </div>
            <!-- end col. -->
            <!-- start login -->
            <div class="col-md-4" style="margin-top: 100px;">
                        <h2 style="font-weight: bold; font-size: 30px; margin-bottom: 30px;">Sign In</h2>
                        <form method="POST" action="{{ route('login') }}">
                            @csrf
                            <div class="input-group flex-nowrap mb-4">
                                <span class="input-group-text icon" id="addon-wrapping">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-fill" viewBox="0 0 16 16">
                                    <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
                                  </svg>
                                </span>
                                <input id="email" type="email" class="custom-form-control @error('email') is-invalid @enderror" name="email" value="{{ old('email') }}" required autocomplete="email" placeholder="Enter email address" > <br />
    
                                
                              </div>
                                @error('email')
                                <small style="padding-left: 15px; color:tomato">
                                    <strong>{{ $message }}</strong>
                                </small>
                                @enderror

                              <div class="input-group flex-nowrap mb-4">
                                <span class="input-group-text icon" id="addon-wrapping">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-lock2-fill" viewBox="0 0 16 16">
                                        <path d="M7 6a1 1 0 0 1 2 0v1H7V6z"/>
                                        <path d="M12 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm-2 6v1.076c.54.166 1 .597 1 1.224v2.4c0 .816-.781 1.3-1.5 1.3h-3c-.719 0-1.5-.484-1.5-1.3V8.3c0-.627.46-1.058 1-1.224V6a2 2 0 1 1 4 0z"/>
                                      </svg>
                                </span>
                                <input id="password" type="password" placeholder="Enter your password" class="custom-form-control @error('password') is-invalid @enderror" name="password" required autocomplete="current-password" aria-describedby="addon-wrapping">
    
                              </div>
                              @error('password')
                                <small style="padding-left: 15px; color:tomato">
                                    <strong>{{ $message }}</strong>
                                </small>
                                @enderror
    
                            <div class="form-group mb-4" style="padding-left: 15px;">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" name="remember" id="remember" {{ old('remember') ? 'checked' : '' }}>
    
                                    <label class="form-check-label" for="remember">
                                        {{ __('Remember Me') }}
                                    </label>
                                </div>
                            </div>
    
                            <div class="form-group mb-3" style="padding-left: 15px;">
                                <button type="submit" class="btn btn-primary" style="padding:5px 20px">
                                    {{ __('Login') }}
                                </button>
                            </div>
                            <div class="form-group mt-5">
                                @if (Route::has('password.request'))
                                <a class="btn btn-link" href="{{ route('password.request') }}">Forgot your password?</a>
                                @endif
                            </div>
                        </form>
            </div>
            <!-- end login -->
        </div>
    </div>
    <footer class="footer">
        <p style="padding-top: 20px;">Copyright &copy; <?php echo date('Y') ?> <strong>Humanitarian and Development Coordination Office</strong></p>
        <p style="color: gray;">Developed by WhoAmI</p>
    </footer>
</body>
</html>
