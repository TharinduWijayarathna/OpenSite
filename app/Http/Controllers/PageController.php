<?php

namespace App\Http\Controllers;

use App\Services\PageService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class PageController extends Controller
{
    public function __construct(private PageService $pageService) {}

    /**
     * Display a listing of published pages
     */
    public function index(Request $request): Response
    {
        $perPage = $request->get('per_page', 12);
        $pages = $this->pageService->getPublishedPages($perPage);

        return Inertia::render('Pages/Index', [
            'pages' => $pages,
        ]);
    }

    /**
     * Display a specific published page by slug
     */
    public function show(Request $request, string $slug): Response
    {
        $preview = $request->boolean('preview');

        if ($preview && Auth::check()) {
            $page = $this->pageService->findBySlug($slug);
        } else {
            $page = $this->pageService->findPublishedBySlug($slug);
        }

        if (! $page) {
            abort(404);
        }

        return Inertia::render('Pages/Show', [
            'page' => $page,
            'template' => $page->template,
            'preview' => $preview,
        ]);
    }
}
