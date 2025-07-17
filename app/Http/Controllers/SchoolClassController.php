<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\SchoolClass;

class SchoolClassController extends Controller
{
    public function index(Request $request)
    {
        $reference = SchoolClass::with([
            'grade',
            'class',
        ])->get();

        return response()->json($reference);
    }

}
