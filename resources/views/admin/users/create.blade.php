<!-- resources/views/admin/users/create.blade.php -->
@extends('layouts.app')

@section('content')
    <h2>Create New User</h2>
    <form method="POST" action="{{ route('admin.users.store') }}">
        @csrf
        <label>Name 111:</label><input type="text" name="name" required><br>
        <label>Email:</label><input type="email" name="email" required><br>
        <label>Password:</label><input type="password" name="password" required><br>
        <label>Role:</label>
        <select name="role">
            <option value="doctor">Doctor</option>
            <option value="admin">Admin</option>
            <option value="nurse">Nurse</option>
        </select><br>
        <button type="submit">Create</button>
    </form>
@endsection
