@extends('layouts.app')
@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-3">
            @include('agency.master.leftpanel')
        </div>
        <!-- left col -->
        <div class="col-md-8">
            <div id="requestTravel"></div>
        </div>
        <!-- end left col -->
    </div>
</div>
@endsection
