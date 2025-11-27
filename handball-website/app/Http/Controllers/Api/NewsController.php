<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\News;
use Illuminate\Http\Request;

class NewsController extends Controller
{
    public function index()
    {
        return News::all();
    }

    public function show($id)
    {
        return News::findOrFail($id);
    }

    public function store(Request $request)
    {
        $news = News::create($request->all());
        return response()->json($news, 201);
    }

    public function update(Request $request, $id)
    {
        $news = News::findOrFail($id);
        $news->update($request->all());
        return response()->json($news, 200);
    }

    public function destroy($id)
    {
        News::destroy($id);
        return response()->json(null, 204);
    }
}