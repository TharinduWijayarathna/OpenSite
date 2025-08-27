<?php

use App\Http\Controllers\Admin\PageController as AdminPageController;
use App\Http\Controllers\PageController;
use App\Models\Page;
use App\Services\PageService;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

// Public page routes
Route::get('/pages', [PageController::class, 'index'])->name('pages.index');
Route::get('/page/{slug}', [PageController::class, 'show'])->name('pages.show');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function (PageService $pageService) {
        $pageStats = $pageService->getStatistics();
        $recentPages = Page::with(['creator'])
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($page) {
                return [
                    'id' => $page->id,
                    'title' => $page->title,
                    'slug' => $page->slug,
                    'status' => $page->status,
                    'created_at' => $page->created_at->toISOString(),
                    'updated_at' => $page->updated_at->toISOString(),
                    'creator' => $page->creator ? ['name' => $page->creator->name] : null,
                ];
            });

        return Inertia::render('dashboard', [
            'pageStats' => $pageStats,
            'recentPages' => $recentPages,
        ]);
    })->name('dashboard');

    // Admin page management routes
    Route::prefix('admin')->name('admin.')->group(function () {
        Route::resource('pages', AdminPageController::class);

        // Additional page actions
        Route::post('pages/{page}/publish', [AdminPageController::class, 'publish'])->name('pages.publish');
        Route::post('pages/{page}/unpublish', [AdminPageController::class, 'unpublish'])->name('pages.unpublish');
        Route::post('pages/{page}/archive', [AdminPageController::class, 'archive'])->name('pages.archive');
        Route::post('pages/{page}/duplicate', [AdminPageController::class, 'duplicate'])->name('pages.duplicate');
        Route::post('pages/bulk', [AdminPageController::class, 'bulk'])->name('pages.bulk');
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
