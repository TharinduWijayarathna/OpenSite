<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Page extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'excerpt',
        'content',
        'meta_data',
        'status',
        'template',
        'sort_order',
        'published_at',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'meta_data' => 'array',
        'published_at' => 'datetime',
        'sort_order' => 'integer',
    ];

    // Relationships
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updater(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public function contents(): HasMany
    {
        return $this->hasMany(PageContent::class)->orderBy('priority');
    }

    // Scopes
    public function scopePublished(Builder $query): Builder
    {
        return $query->where('status', 'published')
            ->where(function ($q) {
                $q->whereNull('published_at')
                    ->orWhere('published_at', '<=', now());
            });
    }

    public function scopeDraft(Builder $query): Builder
    {
        return $query->where('status', 'draft');
    }

    public function scopeBySlug(Builder $query, string $slug): Builder
    {
        return $query->where('slug', $slug);
    }

    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('sort_order')->orderBy('created_at', 'desc');
    }

    // Accessors & Mutators
    public function getIsPublishedAttribute(): bool
    {
        return $this->status === 'published' &&
               ($this->published_at === null || $this->published_at <= now());
    }

    public function getMetaTitleAttribute(): ?string
    {
        return $this->meta_data['title'] ?? $this->title;
    }

    public function getMetaDescriptionAttribute(): ?string
    {
        return $this->meta_data['description'] ?? $this->excerpt;
    }

    // Methods
    public function publish(?Carbon $publishedAt = null): bool
    {
        $this->status = 'published';
        $this->published_at = $publishedAt ?? now();

        return $this->save();
    }

    public function unpublish(): bool
    {
        $this->status = 'draft';

        return $this->save();
    }

    public function archive(): bool
    {
        $this->status = 'archived';

        return $this->save();
    }
}
