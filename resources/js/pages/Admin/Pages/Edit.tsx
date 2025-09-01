import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import admin from '@/routes/admin';
import pages from '@/routes/pages';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { Archive, ArrowLeft, Calendar, Copy, Eye, FileText, Globe, Hash, Save, Search, Settings, Trash2, Plus } from 'lucide-react';
import React, { useState } from 'react';

interface Page {
    id: number;
    title: string;
    slug: string;
    excerpt?: string;
    content: string;
    status: 'draft' | 'published' | 'archived';
    template: string;
    sort_order: number;
    published_at?: string;
    created_at: string;
    updated_at: string;
    creator?: {
        id: number;
        name: string;
    };
    updater?: {
        id: number;
        name: string;
    };
    is_published: boolean;
    meta_data?: {
        title?: string;
        description?: string;
        keywords?: string;
    };
    contents?: Array<{
        id?: number;
        priority: number;
        text?: string;
        images?: string[];
    }>;
}

interface EditPageProps {
    page: Page;
    templates: Record<string, string>;
    statuses: Record<string, string>;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Pages',
        href: admin.pages.index().url,
    },
    {
        title: 'Edit Page',
    },
];

interface PageData {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    status: string;
    template: string;
    sort_order: number;
    published_at: string;
    meta_data: {
        title: string;
        description: string;
        keywords: string;
    };
    contents: Array<{
        id?: number;
        priority: number;
        text: string;
        images: (File | string)[];
    }>;
}

function Edit() {
    const { page, templates, statuses } = usePage<EditPageProps>().props;
    const [generateSlug, setGenerateSlug] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const { data, setData, put, processing, errors, isDirty } = useForm<PageData>({
        title: page.title || '',
        slug: page.slug || '',
        excerpt: page.excerpt || '',
        content: page.content || '',
        status: page.status || 'draft',
        template: page.template || 'default',
        sort_order: page.sort_order || 0,
        published_at: page.published_at ? new Date(page.published_at).toISOString().slice(0, 16) : '',
        meta_data: {
            title: page.meta_data?.title || '',
            description: page.meta_data?.description || '',
            keywords: page.meta_data?.keywords || '',
        },
        contents: (page.contents || []).map((c) => ({
            id: (c as any).id,
            priority: c.priority,
            text: (c as any).text || '',
            images: (c.images || []),
        })),
    });

    const generateSlugFromTitle = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9 -]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
    };

    const handleTitleChange = (title: string) => {
        setData('title', title);
        if (generateSlug) {
            setData('slug', generateSlugFromTitle(title));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('slug', data.slug);
        formData.append('excerpt', data.excerpt);
        formData.append('content', data.content);
        formData.append('status', data.status);
        formData.append('template', data.template);
        formData.append('sort_order', String(data.sort_order));
        if (data.status === 'published' && data.published_at) {
            formData.append('published_at', data.published_at);
        }
        formData.append('meta_data[title]', data.meta_data.title || '');
        formData.append('meta_data[description]', data.meta_data.description || '');
        formData.append('meta_data[keywords]', data.meta_data.keywords || '');

        (data.contents || []).forEach((block, index) => {
            formData.append(`contents[${index}][priority]`, String(block.priority || 0));
            formData.append(`contents[${index}][text]`, block.text || '');
            (block.images || []).forEach((img) => {
                formData.append(`contents[${index}][images][]`, img as any);
            });
        });

        put(admin.pages.update(page.id).url, {
            data: formData,
            forceFormData: true,
            onSuccess: () => {
                // Success handled by backend redirect
            },
        });
    };

    const handlePublish = () => {
        router.post(admin.pages.publish(page.id).url);
    };

    const handleUnpublish = () => {
        router.post(admin.pages.unpublish(page.id).url);
    };

    const handleArchive = () => {
        router.post(admin.pages.archive(page.id).url);
    };

    const handleDuplicate = () => {
        router.post(admin.pages.duplicate(page.id).url);
    };

    const handleDelete = () => {
        router.delete(admin.pages.destroy(page.id).url);
    };

    const previewUrl = data.slug ? `/page/${data.slug}?preview=1` : '#';

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <>
            <Head title={`Edit: ${page.title}`} />

            <div className="container mx-auto py-6">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold">Edit Page</h1>
                            <p className="text-muted-foreground">
                                Last updated {formatDate(page.updated_at)}
                                {page.updater && ` by ${page.updater.name}`}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {page.is_published && (
                            <Button variant="outline" size="sm" asChild>
                                <a href={pages.show(page.slug).url} target="_blank" rel="noopener noreferrer">
                                    <Globe className="mr-2 h-4 w-4" />
                                    View Live
                                </a>
                            </Button>
                        )}

                        <Button variant="outline" size="sm" asChild>
                            <a href={previewUrl} target="_blank" rel="noopener noreferrer">
                                <Eye className="mr-2 h-4 w-4" />
                                Preview
                            </a>
                        </Button>

                        <Button variant="outline" size="sm" onClick={handleDuplicate}>
                            <Copy className="mr-2 h-4 w-4" />
                            Duplicate
                        </Button>

                        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                            <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Page</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Are you sure you want to delete "{page.title}"? This action cannot be undone.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                                        Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Basic Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5" />
                                    Page Content
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Title *</Label>
                                    <Input
                                        id="title"
                                        value={data.title}
                                        onChange={(e) => handleTitleChange(e.target.value)}
                                        placeholder="Enter page title..."
                                        className={errors.title ? 'border-destructive' : ''}
                                    />
                                    {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="slug">URL Slug</Label>
                                        <div className="flex items-center space-x-2">
                                            <Switch checked={generateSlug} onCheckedChange={setGenerateSlug} id="generate-slug" />
                                            <Label htmlFor="generate-slug" className="text-sm">
                                                Auto-generate
                                            </Label>
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <Hash className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                                        <Input
                                            id="slug"
                                            value={data.slug}
                                            onChange={(e) => setData('slug', e.target.value)}
                                            placeholder="page-url-slug"
                                            className={`pl-10 ${errors.slug ? 'border-destructive' : ''}`}
                                            disabled={generateSlug}
                                        />
                                    </div>
                                    {errors.slug && <p className="text-sm text-destructive">{errors.slug}</p>}
                                    {data.slug && (
                                        <p className="text-sm text-muted-foreground">
                                            URL: <span className="font-mono">/page/{data.slug}</span>
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="excerpt">Excerpt</Label>
                                    <Textarea
                                        id="excerpt"
                                        value={data.excerpt}
                                        onChange={(e) => setData('excerpt', e.target.value)}
                                        placeholder="Brief description of the page..."
                                        rows={3}
                                        className={errors.excerpt ? 'border-destructive' : ''}
                                    />
                                    {errors.excerpt && <p className="text-sm text-destructive">{errors.excerpt}</p>}
                                    <p className="text-xs text-muted-foreground">Optional summary that appears in search results and page listings</p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="content">Content *</Label>
                                    <Textarea
                                        id="content"
                                        value={data.content}
                                        onChange={(e) => setData('content', e.target.value)}
                                        placeholder="Write your page content here..."
                                        rows={12}
                                        className={errors.content ? 'border-destructive' : ''}
                                    />
                                    {errors.content && <p className="text-sm text-destructive">{errors.content}</p>}
                                </div>

                                {/* Dynamic Content Blocks */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm font-medium">Content Blocks</h3>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setData('contents', [
                                                ...(data.contents || []),
                                                { priority: (data.contents?.length || 0) + 1, text: '', images: [] },
                                            ])}
                                        >
                                            <Plus className="mr-2 h-4 w-4" /> Add Block
                                        </Button>
                                    </div>

                                    {(data.contents || []).map((block, idx) => (
                                        <div key={idx} className="rounded-md border p-3 space-y-3">
                                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
                                                <div className="sm:col-span-1">
                                                    <Label>Priority</Label>
                                                    <Input
                                                        type="number"
                                                        value={block.priority}
                                                        onChange={(e) => {
                                                            const next = [...(data.contents || [])];
                                                            next[idx] = { ...block, priority: parseInt(e.target.value) || 0 };
                                                            setData('contents', next);
                                                        }}
                                                    />
                                                </div>
                                                <div className="sm:col-span-3">
                                                    <Label>Text</Label>
                                                    <Textarea
                                                        value={block.text}
                                                        onChange={(e) => {
                                                            const next = [...(data.contents || [])];
                                                            next[idx] = { ...block, text: e.target.value };
                                                            setData('contents', next);
                                                        }}
                                                        rows={3}
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Images</Label>
                                                <Input
                                                    type="file"
                                                    multiple
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        const files = Array.from(e.target.files || []);
                                                        const next = [...(data.contents || [])];
                                                        next[idx] = { ...block, images: files };
                                                        setData('contents', next);
                                                    }}
                                                />
                                                {block.images && block.images.length > 0 && (
                                                    <div className="flex flex-wrap gap-2">
                                                        {block.images.map((img, i) => (
                                                            <span key={i} className="inline-flex items-center rounded border px-2 py-1 text-xs">
                                                                {typeof img === 'string' ? img.split('/').pop() : img.name}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex justify-end">
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => {
                                                        const next = [...(data.contents || [])];
                                                        next.splice(idx, 1);
                                                        setData('contents', next);
                                                    }}
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" /> Remove
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* SEO & Meta Data */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Search className="h-5 w-5" />
                                    SEO & Meta Data
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="meta_title">Meta Title</Label>
                                    <Input
                                        id="meta_title"
                                        value={data.meta_data.title}
                                        onChange={(e) =>
                                            setData('meta_data', {
                                                ...data.meta_data,
                                                title: e.target.value,
                                            })
                                        }
                                        placeholder="Leave blank to use page title"
                                        className={errors['meta_data.title'] ? 'border-destructive' : ''}
                                    />
                                    {errors['meta_data.title'] && <p className="text-sm text-destructive">{errors['meta_data.title']}</p>}
                                    <p className="text-xs text-muted-foreground">Recommended: 50-60 characters</p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="meta_description">Meta Description</Label>
                                    <Textarea
                                        id="meta_description"
                                        value={data.meta_data.description}
                                        onChange={(e) =>
                                            setData('meta_data', {
                                                ...data.meta_data,
                                                description: e.target.value,
                                            })
                                        }
                                        placeholder="Brief description for search engines..."
                                        rows={3}
                                        className={errors['meta_data.description'] ? 'border-destructive' : ''}
                                    />
                                    {errors['meta_data.description'] && <p className="text-sm text-destructive">{errors['meta_data.description']}</p>}
                                    <p className="text-xs text-muted-foreground">Recommended: 150-160 characters</p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="meta_keywords">Keywords</Label>
                                    <Input
                                        id="meta_keywords"
                                        value={data.meta_data.keywords}
                                        onChange={(e) =>
                                            setData('meta_data', {
                                                ...data.meta_data,
                                                keywords: e.target.value,
                                            })
                                        }
                                        placeholder="keyword1, keyword2, keyword3"
                                        className={errors['meta_data.keywords'] ? 'border-destructive' : ''}
                                    />
                                    {errors['meta_data.keywords'] && <p className="text-sm text-destructive">{errors['meta_data.keywords']}</p>}
                                    <p className="text-xs text-muted-foreground">Comma-separated list of relevant keywords</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Quick Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Globe className="h-5 w-5" />
                                    Quick Actions
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {page.status === 'published' ? (
                                    <Button onClick={handleUnpublish} variant="outline" className="w-full">
                                        Unpublish
                                    </Button>
                                ) : (
                                    <Button onClick={handlePublish} variant="outline" className="w-full">
                                        Publish Now
                                    </Button>
                                )}

                                {page.status !== 'archived' && (
                                    <Button onClick={handleArchive} variant="outline" className="w-full">
                                        <Archive className="mr-2 h-4 w-4" />
                                        Archive
                                    </Button>
                                )}
                            </CardContent>
                        </Card>

                        {/* Publish Settings */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Settings className="h-5 w-5" />
                                    Publish Settings
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Status</Label>
                                    <Select value={data.status} onValueChange={(value) => setData('status', value)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.entries(statuses).map(([value, label]) => (
                                                <SelectItem key={value} value={value}>
                                                    {label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.status && <p className="text-sm text-destructive">{errors.status}</p>}
                                </div>

                                {data.status === 'published' && (
                                    <div className="space-y-2">
                                        <Label htmlFor="published_at">Publish Date</Label>
                                        <Input
                                            id="published_at"
                                            type="datetime-local"
                                            value={data.published_at}
                                            onChange={(e) => setData('published_at', e.target.value)}
                                            className={errors.published_at ? 'border-destructive' : ''}
                                        />
                                        {errors.published_at && <p className="text-sm text-destructive">{errors.published_at}</p>}
                                        <p className="text-xs text-muted-foreground">Leave blank to publish immediately</p>
                                    </div>
                                )}

                                <Separator />

                                <Button type="submit" disabled={processing || !isDirty} className="w-full">
                                    <Save className="mr-2 h-4 w-4" />
                                    {processing ? 'Updating...' : 'Update Page'}
                                </Button>

                                {!isDirty && <p className="text-center text-xs text-muted-foreground">No changes to save</p>}
                            </CardContent>
                        </Card>

                        {/* Page Settings */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Page Settings</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Template</Label>
                                    <Select value={data.template} onValueChange={(value) => setData('template', value)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.entries(templates).map(([value, label]) => (
                                                <SelectItem key={value} value={value}>
                                                    {label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.template && <p className="text-sm text-destructive">{errors.template}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="sort_order">Sort Order</Label>
                                    <Input
                                        id="sort_order"
                                        type="number"
                                        value={data.sort_order}
                                        onChange={(e) => setData('sort_order', parseInt(e.target.value) || 0)}
                                        min="0"
                                        className={errors.sort_order ? 'border-destructive' : ''}
                                    />
                                    {errors.sort_order && <p className="text-sm text-destructive">{errors.sort_order}</p>}
                                    <p className="text-xs text-muted-foreground">Higher numbers appear first in listings</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Page Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5" />
                                    Page Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">ID:</span>
                                    <span className="font-mono">#{page.id}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Created:</span>
                                    <span>{formatDate(page.created_at)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Updated:</span>
                                    <span>{formatDate(page.updated_at)}</span>
                                </div>
                                {page.creator && (
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Created by:</span>
                                        <span>{page.creator.name}</span>
                                    </div>
                                )}
                                {page.updater && (
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Updated by:</span>
                                        <span>{page.updater.name}</span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Page Preview */}
                        {data.title && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Eye className="h-5 w-5" />
                                        Search Preview
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div>
                                        <h3 className="text-lg font-semibold text-blue-600 hover:text-blue-800">
                                            {data.meta_data.title || data.title}
                                        </h3>
                                        <p className="text-sm text-green-700">
                                            {window.location.origin}/page/{data.slug}
                                        </p>
                                        <p className="mt-1 text-sm text-gray-600">
                                            {data.meta_data.description || data.excerpt || 'No description available.'}
                                        </p>
                                    </div>

                                    <div className="border-t pt-2">
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <Badge variant="outline">{templates[data.template] || data.template}</Badge>
                                            <Badge variant={data.status === 'published' ? 'default' : 'secondary'}>
                                                {statuses[data.status] || data.status}
                                            </Badge>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </form>
            </div>
        </>
    );
}

export default function EditWithLayout() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Edit />
        </AppLayout>
    );
}
