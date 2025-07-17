<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Cache;

class CacheController extends Controller
{
    public function index(Request $request)
    {
        $changes = Cache::with([
            'key',
            'value',
            'expiration',
            'owner',
        ])->get();

        return response()->json($changes);
    }

    public function store(Request $request)
    {
    $validated = $request->validate([
        'key' => 'request',
        'value' => 'request',
        'expiration' => 'request',
        'owner' => 'request',
    ]);
    
    TimetableChange::create($validated);
    return response()->json(['message' => '変更を保存しました']);
    }
}
