<!-- resources/views/admin/users/edit.blade.php -->
@extends('layouts.app')

@section('content')
    <h2>Edit User</h2>
    <form method="POST" action="{{ route('admin.users.update', $user) }}">
        @csrf
        @method('PUT')
        <label>Name:</label><input type="text" name="name" value="{{ $user->name }}" required><br>
        <label>Email:</label><input type="email" name="email" value="{{ $user->email }}" required><br>
        <label>Role:</label>
        <select name="role">
            <option value="doctor" {{ $user->role === 'doctor' ? 'selected' : '' }}>Doctor</option>
            <option value="admin" {{ $user->role === 'admin' ? 'selected' : '' }}>Admin</option>
            <option value="nurse" {{ $user->role === 'nurse' ? 'selected' : '' }}>Nurse</option>
        </select><br>
        <button type="submit">Update</button>
    </form>
@endsection
