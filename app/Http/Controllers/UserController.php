<?php

namespace App\Http\Controllers;
use App\Models\User;

use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $User_state = User::select([
            'name',
            'email',
            'password',
            'type',
            'school_class_grade',
            'school_class_class',
            'email_verified_at',
        ])->get();

        return response()->json($User_state);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|',
            'email' => 'required|date',
            'password' => 'required|in:approved,rejected,pending',
            'type' => 'required|in:student,teacher,administrator',
            'school_class_grade' => 'required|integer',
            'school_class_class' => 'required|integer',
            'email_verified_at' => 'required|nullable',
        ]);
    
        TimetableChange::create($validated);
        return response()->json(['message' => '変更を保存しました']);
    }

    public function destroy($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'ユーザーが見つかりません'], 404);
        }
        $user->delete();
        return response()->json(['message' => 'ユーザーを削除しました']);
    }
}
