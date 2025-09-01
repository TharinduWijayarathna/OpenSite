<?php

namespace App\Services;

use App\Models\Page;
use App\Models\User;
use Exception;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PageService
{
    /**
     * Get all pages with optional filtering
     */
    public function getAllPages(array $filters = []): LengthAwarePaginator
    {
        $query = Page::with(['creator', 'updater', 'contents']);

        // Apply filters
        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (isset($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('title', 'like', '%'.$filters['search'].'%')
                    ->orWhere('content', 'like', '%'.$filters['search'].'%')
                    ->orWhere('excerpt', 'like', '%'.$filters['search'].'%');
            });
        }

        if (isset($filters['template'])) {
            $query->where('template', $filters['template']);
        }

        // Default ordering
        $query->ordered();

        return $query->paginate($filters['per_page'] ?? 15);
    }

    /**
     * Get published pages for public display
     */
    public function getPublishedPages(int $perPage = 15): LengthAwarePaginator
    {
        return Page::published()
            ->ordered()
            ->paginate($perPage);
    }

    /**
     * Find page by ID
     */
    public function findPage(int $id): ?Page
    {
        return Page::with(['creator', 'updater', 'contents'])->find($id);
    }

    /**
     * Find page by slug
     */
    public function findBySlug(string $slug): ?Page
    {
        return Page::with(['contents'])->bySlug($slug)->first();
    }

    /**
     * Find published page by slug
     */
    public function findPublishedBySlug(string $slug): ?Page
    {
        return Page::published()->with(['contents'])->bySlug($slug)->first();
    }

    /**
     * Create a new page
     */
    public function createPage(array $data, ?User $user = null): Page
    {
        DB::beginTransaction();

        try {
            // Generate slug if not provided
            if (empty($data['slug'])) {
                $data['slug'] = $this->generateUniqueSlug($data['title']);
            } else {
                $data['slug'] = $this->ensureUniqueSlug($data['slug']);
            }

            // Set creator
            if ($user) {
                $data['created_by'] = $user->id;
                $data['updated_by'] = $user->id;
            }

            // Handle meta data
            if (isset($data['meta_data']) && is_array($data['meta_data'])) {
                $data['meta_data'] = array_filter($data['meta_data']);
            }

            $contents = $data['contents'] ?? null;
            unset($data['contents']);

            $page = Page::create($data);

            if (is_array($contents)) {
                foreach ($contents as $contentData) {
                    $page->contents()->create([
                        'priority' => (int)($contentData['priority'] ?? 0),
                        'text' => $contentData['text'] ?? null,
                        'images' => $contentData['images'] ?? [],
                    ]);
                }
            }

            DB::commit();

            return $page->fresh(['creator', 'updater']);
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Update a page
     */
    public function updatePage(int $id, array $data, ?User $user = null): Page
    {
        DB::beginTransaction();

        try {
            $page = Page::findOrFail($id);

            // Handle slug update
            if (isset($data['slug']) && $data['slug'] !== $page->slug) {
                $data['slug'] = $this->ensureUniqueSlug($data['slug'], $id);
            }

            // Set updater
            if ($user) {
                $data['updated_by'] = $user->id;
            }

            // Handle meta data
            if (isset($data['meta_data']) && is_array($data['meta_data'])) {
                $data['meta_data'] = array_filter($data['meta_data']);
            }

            $contents = $data['contents'] ?? null;
            unset($data['contents']);

            $page->update($data);

            if (is_array($contents)) {
                // Replace existing contents for simplicity
                $page->contents()->delete();
                foreach ($contents as $contentData) {
                    $page->contents()->create([
                        'priority' => (int)($contentData['priority'] ?? 0),
                        'text' => $contentData['text'] ?? null,
                        'images' => $contentData['images'] ?? [],
                    ]);
                }
            }

            DB::commit();

            return $page->fresh(['creator', 'updater']);
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Delete a page
     */
    public function deletePage(int $id): bool
    {
        $page = Page::findOrFail($id);

        return $page->delete();
    }

    /**
     * Publish a page
     */
    public function publishPage(int $id, ?User $user = null): Page
    {
        $page = Page::findOrFail($id);

        if ($user) {
            $page->updated_by = $user->id;
        }

        $page->publish();

        return $page->fresh(['creator', 'updater']);
    }

    /**
     * Unpublish a page
     */
    public function unpublishPage(int $id, ?User $user = null): Page
    {
        $page = Page::findOrFail($id);

        if ($user) {
            $page->updated_by = $user->id;
        }

        $page->unpublish();

        return $page->fresh(['creator', 'updater']);
    }

    /**
     * Archive a page
     */
    public function archivePage(int $id, ?User $user = null): Page
    {
        $page = Page::findOrFail($id);

        if ($user) {
            $page->updated_by = $user->id;
        }

        $page->archive();

        return $page->fresh(['creator', 'updater']);
    }

    /**
     * Duplicate a page
     */
    public function duplicatePage(int $id, ?User $user = null): Page
    {
        $originalPage = Page::findOrFail($id);

        $data = $originalPage->toArray();
        unset($data['id'], $data['created_at'], $data['updated_at']);

        // Modify title and slug for duplicate
        $data['title'] = $data['title'].' (Copy)';
        $data['slug'] = $this->generateUniqueSlug($data['title']);
        $data['status'] = 'draft';
        $data['published_at'] = null;

        return $this->createPage($data, $user);
    }

    /**
     * Bulk update pages
     */
    public function bulkUpdate(array $ids, array $data, ?User $user = null): int
    {
        if ($user) {
            $data['updated_by'] = $user->id;
        }

        return Page::whereIn('id', $ids)->update($data);
    }

    /**
     * Bulk delete pages
     */
    public function bulkDelete(array $ids): int
    {
        return Page::whereIn('id', $ids)->delete();
    }

    /**
     * Get page statistics
     */
    public function getStatistics(): array
    {
        return [
            'total' => Page::count(),
            'published' => Page::where('status', 'published')->count(),
            'draft' => Page::where('status', 'draft')->count(),
            'archived' => Page::where('status', 'archived')->count(),
        ];
    }

    /**
     * Generate unique slug from title
     */
    private function generateUniqueSlug(string $title, ?int $excludeId = null): string
    {
        $baseSlug = Str::slug($title);

        return $this->ensureUniqueSlug($baseSlug, $excludeId);
    }

    /**
     * Ensure slug is unique
     */
    private function ensureUniqueSlug(string $slug, ?int $excludeId = null): string
    {
        $originalSlug = $slug;
        $counter = 1;

        while ($this->slugExists($slug, $excludeId)) {
            $slug = $originalSlug.'-'.$counter;
            $counter++;
        }

        return $slug;
    }

    /**
     * Check if slug exists
     */
    private function slugExists(string $slug, ?int $excludeId = null): bool
    {
        $query = Page::where('slug', $slug);

        if ($excludeId) {
            $query->where('id', '!=', $excludeId);
        }

        return $query->exists();
    }

    /**
     * Get available templates
     */
    public function getAvailableTemplates(): array
    {
        return [
            'default' => 'Default Template',
            'landing' => 'Landing Page',
            'blog' => 'Blog Post',
            'portfolio' => 'Portfolio Item',
            'contact' => 'Contact Page',
        ];
    }

    /**
     * Get page statuses
     */
    public function getStatuses(): array
    {
        return [
            'draft' => 'Draft',
            'published' => 'Published',
            'archived' => 'Archived',
        ];
    }
}
