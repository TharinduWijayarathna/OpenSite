<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\PageService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class PageController extends Controller
{
    public function __construct(private PageService $pageService) {}

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $filters = $request->only(['search', 'status', 'template', 'per_page']);
        $pages = $this->pageService->getAllPages($filters);
        $statistics = $this->pageService->getStatistics();

        return Inertia::render('Admin/Pages/Index', [
            'pages' => $pages,
            'statistics' => $statistics,
            'filters' => $filters,
            'statuses' => $this->pageService->getStatuses(),
            'templates' => $this->pageService->getAvailableTemplates(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/Pages/Create', [
            'templates' => $this->pageService->getAvailableTemplates(),
            'statuses' => $this->pageService->getStatuses(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:pages,slug',
            'excerpt' => 'nullable|string|max:1000',
            'content' => 'required|string',
            'status' => ['required', Rule::in(['draft', 'published', 'archived'])],
            'template' => 'required|string|max:255',
            'sort_order' => 'nullable|integer|min:0',
            'published_at' => 'nullable|date',
            'meta_data' => 'nullable|array',
            'meta_data.title' => 'nullable|string|max:255',
            'meta_data.description' => 'nullable|string|max:500',
            'meta_data.keywords' => 'nullable|string|max:255',
            'contents' => 'nullable|array',
            'contents.*.priority' => 'nullable|integer|min:0',
            'contents.*.text' => 'nullable|string',
            'contents.*.images' => 'nullable|array',
            'contents.*.images.*' => 'nullable',
        ]);

        try {
            // Handle images: convert uploaded files to stored paths
            if (! empty($validated['contents'])) {
                foreach ($validated['contents'] as $i => $content) {
                    if (! empty($content['images'])) {
                        $paths = [];
                        foreach ($content['images'] as $image) {
                            if ($image instanceof UploadedFile) {
                                $paths[] = $image->store('page-contents', 'public');
                            } elseif (is_string($image)) {
                                $paths[] = $image;
                            }
                        }
                        $validated['contents'][$i]['images'] = $paths;
                    }
                }
            }

            $page = $this->pageService->createPage($validated, $request->user());

            return redirect()
                ->route('admin.pages.edit', $page)
                ->with('success', 'Page created successfully.');
        } catch (\Exception $e) {
            return back()
                ->withInput()
                ->withErrors(['error' => 'Failed to create page: '.$e->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id): Response
    {
        $page = $this->pageService->findPage($id);

        if (! $page) {
            abort(404);
        }

        return Inertia::render('Admin/Pages/Show', [
            'page' => $page,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(int $id): Response
    {
        $page = $this->pageService->findPage($id);

        if (! $page) {
            abort(404);
        }

        return Inertia::render('Admin/Pages/Edit', [
            'page' => $page,
            'templates' => $this->pageService->getAvailableTemplates(),
            'statuses' => $this->pageService->getStatuses(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, int $id): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => ['nullable', 'string', 'max:255', Rule::unique('pages', 'slug')->ignore($id)],
            'excerpt' => 'nullable|string|max:1000',
            'content' => 'required|string',
            'status' => ['required', Rule::in(['draft', 'published', 'archived'])],
            'template' => 'required|string|max:255',
            'sort_order' => 'nullable|integer|min:0',
            'published_at' => 'nullable|date',
            'meta_data' => 'nullable|array',
            'meta_data.title' => 'nullable|string|max:255',
            'meta_data.description' => 'nullable|string|max:500',
            'meta_data.keywords' => 'nullable|string|max:255',
            'contents' => 'nullable|array',
            'contents.*.priority' => 'nullable|integer|min:0',
            'contents.*.text' => 'nullable|string',
            'contents.*.images' => 'nullable|array',
            'contents.*.images.*' => 'nullable',
        ]);

        try {
            if (! empty($validated['contents'])) {
                foreach ($validated['contents'] as $i => $content) {
                    if (! empty($content['images'])) {
                        $paths = [];
                        foreach ($content['images'] as $image) {
                            if ($image instanceof UploadedFile) {
                                $paths[] = $image->store('page-contents', 'public');
                            } elseif (is_string($image)) {
                                $paths[] = $image;
                            }
                        }
                        $validated['contents'][$i]['images'] = $paths;
                    }
                }
            }

            $page = $this->pageService->updatePage($id, $validated, $request->user());

            return redirect()
                ->route('admin.pages.edit', $page)
                ->with('success', 'Page updated successfully.');
        } catch (\Exception $e) {
            return back()
                ->withInput()
                ->withErrors(['error' => 'Failed to update page: '.$e->getMessage()]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id): RedirectResponse
    {
        try {
            $this->pageService->deletePage($id);

            return redirect()
                ->route('admin.pages.index')
                ->with('success', 'Page deleted successfully.');
        } catch (\Exception $e) {
            return back()
                ->withErrors(['error' => 'Failed to delete page: '.$e->getMessage()]);
        }
    }

    /**
     * Publish a page
     */
    public function publish(int $id): RedirectResponse
    {
        try {
            $this->pageService->publishPage($id, request()->user());

            return back()->with('success', 'Page published successfully.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to publish page: '.$e->getMessage()]);
        }
    }

    /**
     * Unpublish a page
     */
    public function unpublish(int $id): RedirectResponse
    {
        try {
            $this->pageService->unpublishPage($id, request()->user());

            return back()->with('success', 'Page unpublished successfully.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to unpublish page: '.$e->getMessage()]);
        }
    }

    /**
     * Archive a page
     */
    public function archive(int $id): RedirectResponse
    {
        try {
            $this->pageService->archivePage($id, request()->user());

            return back()->with('success', 'Page archived successfully.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to archive page: '.$e->getMessage()]);
        }
    }

    /**
     * Duplicate a page
     */
    public function duplicate(int $id): RedirectResponse
    {
        try {
            $page = $this->pageService->duplicatePage($id, request()->user());

            return redirect()
                ->route('admin.pages.edit', $page)
                ->with('success', 'Page duplicated successfully.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to duplicate page: '.$e->getMessage()]);
        }
    }

    /**
     * Bulk operations
     */
    public function bulk(Request $request): RedirectResponse
    {
        $request->validate([
            'action' => 'required|string|in:delete,publish,unpublish,archive',
            'ids' => 'required|array|min:1',
            'ids.*' => 'integer|exists:pages,id',
        ]);

        $action = $request->input('action');
        $ids = $request->input('ids');

        try {
            switch ($action) {
                case 'delete':
                    $count = $this->pageService->bulkDelete($ids);

                    return back()->with('success', "Deleted {$count} pages successfully.");

                case 'publish':
                    $count = $this->pageService->bulkUpdate($ids, ['status' => 'published', 'published_at' => now()], $request->user());

                    return back()->with('success', "Published {$count} pages successfully.");

                case 'unpublish':
                    $count = $this->pageService->bulkUpdate($ids, ['status' => 'draft'], $request->user());

                    return back()->with('success', "Unpublished {$count} pages successfully.");

                case 'archive':
                    $count = $this->pageService->bulkUpdate($ids, ['status' => 'archived'], $request->user());

                    return back()->with('success', "Archived {$count} pages successfully.");
            }
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Bulk operation failed: '.$e->getMessage()]);
        }

        return back();
    }
}
