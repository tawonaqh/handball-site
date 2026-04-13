<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Gallery;
use Illuminate\Http\Request;

class GalleryController extends Controller
{
    public function index() {
        return Gallery::with(['tournament', 'team', 'news'])->get();
    }

    public function show($id) {
        return Gallery::with(['tournament', 'team', 'news'])->findOrFail($id);
    }

    public function store(Request $request) {
        $validated = $request->validate([
            'title' => 'nullable|string',
            'media_url' => 'required|string',
            'media_type' => 'required|in:image,video',
            'tournament_id' => 'nullable|exists:tournaments,id',
            'team_id' => 'nullable|exists:teams,id',
            'news_id' => 'nullable|exists:news,id'
        ]);
        $gallery = Gallery::create($validated);
        return response()->json($gallery, 201);
    }

    public function update(Request $request, $id) {
        $gallery = Gallery::findOrFail($id);
        $gallery->update($request->all());
        return response()->json($gallery, 200);
    }

    public function destroy($id) {
        Gallery::destroy($id);
        return response()->json(null, 204);
    }
}
