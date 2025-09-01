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
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, Eye, FileText, Globe, Hash, Plus, Save, Search, Settings, Trash2 } from 'lucide-react';
import React, { useState } from 'react';

interface CreatePageProps {
    templates: Record<string, string>;
    statuses: Record<string, string>;
    [key: string]: any;
}

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
    contents?: Array<{
        priority: number;
        text: string;
        images: (File | string)[];
    }>;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Pages',
        href: admin.pages.index().url,
    },
    {
        title: 'Create Page',
        href: admin.pages.create().url,
    },
];

function Create() {
    const { templates, statuses } = usePage<CreatePageProps>().props;
    const [generateSlug, setGenerateSlug] = useState(true);

    const { data, setData, post, processing, errors } = useForm<PageData>({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        status: 'draft',
        template: 'default',
        sort_order: 0,
        published_at: '',
        meta_data: {
            title: '',
            description: '',
            keywords: '',
        },
        contents: [],
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

    const handleSubmit = (e: React.FormEvent, action: 'save' | 'save_and_continue' = 'save') => {
        e.preventDefault();

        const submitData = { ...data };

        // Clean up published_at if status is not published
        if (submitData.status !== 'published') {
            submitData.published_at = '';
        }

        post(admin.pages.store().url, {
            forceFormData: true,
            onSuccess: () => {
                if (action === 'save_and_continue') {
                    // The backend will redirect to edit page
                } else {
                    // Redirect to pages index
                }
            },
        });
    };

    const previewUrl = data.slug ? `/page/${data.slug}?preview=1` : '#';

    return (
        <>
            <Head title="Create Page" />

            <div className="flex-1 space-y-4 p-4 md:p-6 lg:p-8">
                {/* Header */}
                <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Create New Page</h1>
                        <p className="text-sm text-muted-foreground sm:text-base">Add a new page to your website</p>
                    </div>

                    <div className="flex items-center gap-2">
                        {data.slug && (
                            <Button variant="outline" size="sm" className="w-full sm:w-auto" asChild>
                                <a href={previewUrl} target="_blank" rel="noopener noreferrer">
                                    <Eye className="mr-2 h-4 w-4" />
                                    Preview
                                </a>
                            </Button>
                        )}
                    </div>
                </div>

                <form onSubmit={(e) => handleSubmit(e, 'save')} className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                    {/* Main Content */}
                    <div className="space-y-6 xl:col-span-2">
                        {/* Basic Information */}
                        <Card>
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <div className="rounded-full bg-blue-100 p-1.5 dark:bg-blue-900/20">
                                        <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    Page Content
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6 pt-0">
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
                                    <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
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
                                            URL: <span className="font-mono text-xs sm:text-sm">/page/{data.slug}</span>
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
                                    <p className="text-xs text-muted-foreground">
                                        Optional summary that appears in search results and page listings
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="content">Content *</Label>
                                    <Textarea
                                        id="content"
                                        value={data.content}
                                        onChange={(e) => setData('content', e.target.value)}
                                        placeholder="Write your page content here..."
                                        rows={8}
                                        className={`min-h-[200px] ${errors.content ? 'border-destructive' : ''}`}
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
                        {/* Publish Settings */}
                        <Card>
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <div className="rounded-full bg-green-100 p-1.5 dark:bg-green-900/20">
                                        <Globe className="h-4 w-4 text-green-600 dark:text-green-400" />
                                    </div>
                                    Publish
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 pt-0">
                                <div className="space-y-2">
                                    <Label htmlFor="status">Status</Label>
                                    <Select value={data.status} onValueChange={(value) => setData('status', value)}>
                                        <SelectTrigger className="w-full">
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

                                <div className="flex flex-col gap-2">
                                    <Button type="submit" disabled={processing} className="w-full">
                                        <Save className="mr-2 h-4 w-4" />
                                        {processing ? 'Creating...' : 'Create Page'}
                                    </Button>

                                    <Button
                                        type="button"
                                        variant="outline"
                                        disabled={processing}
                                        onClick={(e) => handleSubmit(e, 'save_and_continue')}
                                        className="w-full"
                                    >
                                        Create & Edit
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Page Settings */}
                        <Card>
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <div className="rounded-full bg-purple-100 p-1.5 dark:bg-purple-900/20">
                                        <Settings className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    Page Settings
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 pt-0">
                                <div className="space-y-2">
                                    <Label>Template</Label>
                                    <Select value={data.template} onValueChange={(value) => setData('template', value)}>
                                        <SelectTrigger className="w-full">
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
                                        placeholder="0"
                                        className={`w-full ${errors.sort_order ? 'border-destructive' : ''}`}
                                    />
                                    {errors.sort_order && <p className="text-sm text-destructive">{errors.sort_order}</p>}
                                    <p className="text-xs text-muted-foreground">Higher numbers appear first in listings</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Page Preview */}
                        {data.title && (
                            <Card>
                                <CardHeader className="pb-4">
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <div className="rounded-full bg-orange-100 p-1.5 dark:bg-orange-900/20">
                                            <Eye className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                                        </div>
                                        Preview
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3 pt-0">
                                    <div>
                                        <h3 className="text-lg font-semibold text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                                            {data.meta_data.title || data.title}
                                        </h3>
                                        <p className="text-sm text-green-700 dark:text-green-500 break-all">
                                            {window.location.origin}/page/{data.slug || 'page-slug'}
                                        </p>
                                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                            {data.meta_data.description || data.excerpt || 'No description available.'}
                                        </p>
                                    </div>

                                    <div className="border-t pt-3">
                                        <div className="flex flex-wrap items-center gap-2 text-xs">
                                            <Badge variant="outline">{templates[data.template] || data.template}</Badge>
                                            <Badge variant={data.status === 'published' ? 'default' : 'secondary'}>
                                                {statuses[data.status] || data.status}
                                            </Badge>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Actions */}
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex flex-col space-y-3">
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        size="lg"
                                        className="w-full"
                                    >
                                        {processing ? (
                                            <>
                                                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                                Creating...
                                            </>
                                        ) : (
                                            <>
                                                <Plus className="mr-2 h-4 w-4" />
                                                Create Page
                                            </>
                                        )}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="lg"
                                        className="w-full"
                                        disabled={processing}
                                        onClick={(e) => handleSubmit(e, 'save_and_continue')}
                                    >
                                        <Plus className="mr-2 h-4 w-4" />
                                        Create & Edit
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="lg"
                                        className="w-full"
                                        asChild
                                    >
                                        <Link href={admin.pages.index()}>
                                            Cancel
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </form>
            </div>
        </>
    );
}

export default function CreateWithLayout() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Create />
        </AppLayout>
    );
}
