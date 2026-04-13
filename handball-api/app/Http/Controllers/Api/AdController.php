<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ad;
use Illuminate\Http\Request;

class AdController extends Controller
{
    public function index() {
        return Ad::all();
    }

    public function show($id) {
        return Ad::findOrFail($id);
    }

    public function store(Request $request) {
        $validated = $request->validate([
            'title' => 'required|string',
            'image_url' => 'required|string',
            'link' => 'nullable|string',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'active' => 'boolean'
        ]);
        $ad = Ad::create($validated);
        return response()->json($ad, 201);
    }

    public function update(Request $request, $id) {
        $ad = Ad::findOrFail($id);
        $ad->update($request->all());
        return response()->json($ad, 200);
    }

    public function destroy($id) {
        Ad::destroy($id);
        return response()->json(null, 204);
    }
}
