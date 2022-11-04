@extends('layouts.app')

@section('content')
<div class='container'>
    <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
            <li class="breadcrumb-item"><a href="/admin/home">Dashboard</a></li>
            <li class="breadcrumb-item active" aria-current="page">Roles</li>
        </ol>
    </nav>
    <div class="row">
        <div class="col-lg-12 margin-tb">
            <div class="pull-left">
                <h2>Role Management</h2>
            </div>
            <div class="d-flex flex-row-reverse mb-2">
                @can('role-create')
                <a class="btn btn-success" href="{{ route('roles.create') }}"> Create New Role</a>
                @endcan
            </div>
        </div>
    </div>

    @if ($message = Session::get('success'))
    <div class="alert alert-success">
        <p>{{ $message }}</p>
    </div>
    @endif

    <table class="table table-bordered">
        <tr>
            <th>No</th>
            <th>Name</th>
            <th width="280px">Action</th>
        </tr>
        @foreach ($roles as $key => $role)
        <tr>
            <td>{{ ++$key }}</td>
            <td>{{ $role->name }}</td>
            <td>
                <a class="btn btn-info" href="{{ route('roles.show',$role->id) }}">Show</a>
                @can('role-edit')
                <a class="btn btn-primary" href="{{ route('roles.edit',$role->id) }}">Edit</a>
                @endcan
                @can('role-delete')
                <button onclick='deleteRole()' class='btn btn-danger'>Delete</button>
                @endcan
            </td>
        </tr>
        @endforeach
    </table>

    <form method='post' action='{{route('roles.destroy', $role->id)}}' id='roleDel-form'>
        @csrf
        {{method_field('DELETE')}}
    </form>

    {!! $roles->render() !!}
</div>

<script>
    function deleteRole() {
        if (confirm('Are your sure?')) {
            document.getElementById('roleDel-form').submit()
        }
    }

</script>

@endsection
