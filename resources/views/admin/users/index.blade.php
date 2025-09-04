<!-- resources/views/admin/users/index.blade.php -->
@extends('layouts.app')

@section('content')
    <h2>User List</h2>
    <a href="{{ route('admin.users.create') }}">Add New User</a>

    <table>
        <thead>
            <tr>
                <th>Name</th><th>Email</th><th>Role</th><th>Actions</th>
            </tr>
        </thead>
        <tbody>
            @foreach($users as $user)
                <tr>
                    <td>{{ $user->name }}</td><td>{{ $user->email }}</td><td>{{ $user->role }}</td>
                    <td>
                        <a href="{{ route('admin.users.edit', $user) }}">Edit</a>
                        <form action="{{ route('admin.users.destroy', $user) }}" method="POST" style="display:inline">
                            @csrf
                            @method('DELETE')
                            <button type="submit" onclick="return confirm('Delete this user?')">Delete</button>
                        </form>
                    </td>
                </tr>
            @endforeach
        </tbody>
    </table>
@endsection
