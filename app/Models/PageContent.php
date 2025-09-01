<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PageContent extends Model
{
    protected $fillable = [
        'page_id',
        'priority',
        'text',
        'images',
    ];

    protected $casts = [
        'images' => 'array',
        'priority' => 'integer',
    ];

    public function page(): BelongsTo
    {
        return $this->belongsTo(Page::class);
    }
}
