import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import admin from '@/routes/admin';
import pages from '@/routes/pages';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Archive, Calendar, ChevronLeft, ChevronRight, Copy, Edit, Eye, FileText, Globe, MoreHorizontal, Plus, Search, Trash2, User } from 'lucide-react';
import React, { useState } from 'react';

interface Page {
    id: number;
    title: string;
    slug: string;
    excerpt?: string;
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
}

interface PaginationData {
    data: Page[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface PageProps {
    pages: PaginationData;
    statistics: {
        total: number;
        published: number;
        draft: number;
        archived: number;
    };
    filters: {
        search?: string;
        status?: string;
        template?: string;
        per_page?: number;
    };
    statuses: Record<string, string>;
    templates: Record<string, string>;
    [key: string]: any;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Pages',
        href: admin.pages.index().url,
    },
];

function Index() {
    const { pages, statistics, filters, statuses, templates } = usePage<PageProps>().props;
    const [selectedPages, setSelectedPages] = useState<number[]>([]);

    const [showBulkDialog, setShowBulkDialog] = useState(false);
    const [bulkAction, setBulkAction] = useState<string>('');

    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');
    const [templateFilter, setTemplateFilter] = useState(filters.template || 'all');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(admin.pages.index().url, {
            search: searchTerm || undefined,
            status: statusFilter === 'all' ? undefined : statusFilter || undefined,
            template: templateFilter === 'all' ? undefined : templateFilter || undefined,
            per_page: filters.per_page,
        });
    };

    const clearFilters = () => {
        setSearchTerm('');
        setStatusFilter('all');
        setTemplateFilter('all');
        router.get(admin.pages.index().url);
    };

    const handleSelectAll = (checked: boolean) => {
        setSelectedPages(checked ? pages.data.map((page) => page.id) : []);
    };

    const handleSelectPage = (pageId: number, checked: boolean) => {
        setSelectedPages((prev) => (checked ? [...prev, pageId] : prev.filter((id) => id !== pageId)));
    };

    const handleBulkAction = (action: string) => {
        if (selectedPages.length === 0) return;
        setBulkAction(action);
        setShowBulkDialog(true);
    };

    const confirmBulkAction = () => {
        router.post(
            admin.pages.bulk().url,
            {
                action: bulkAction,
                ids: selectedPages,
            },
            {
                onSuccess: () => {
                    setSelectedPages([]);
                    setShowBulkDialog(false);
                },
            },
        );
    };

    const handleDelete = (pageId: number) => {
        router.delete(admin.pages.destroy(pageId).url);
    };

    const handlePublish = (pageId: number) => {
        router.post(admin.pages.publish(pageId).url);
    };

    const handleUnpublish = (pageId: number) => {
        router.post(admin.pages.unpublish(pageId).url);
    };

    const handleArchive = (pageId: number) => {
        router.post(admin.pages.archive(pageId).url);
    };

    const handleDuplicate = (pageId: number) => {
        router.post(admin.pages.duplicate(pageId).url);
    };

    const getStatusBadge = (status: string) => {
        const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
            published: 'default',
            draft: 'secondary',
            archived: 'outline',
        };

        return <Badge variant={variants[status] || 'secondary'}>{statuses[status] || status}</Badge>;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <>
            <Head title="Pages Management" />

            <div className="flex-1 space-y-4 p-4 md:p-6 lg:p-8">
                {/* Header */}
                <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Pages</h1>
                        <p className="text-sm text-muted-foreground sm:text-base">Manage your website pages</p>
                    </div>
                    <Button size="default" className="w-full sm:w-auto" asChild>
                        <Link href={admin.pages.create()}>
                            <Plus className="mr-2 h-4 w-4" />
                            Create Page
                        </Link>
                    </Button>
                </div>

                {/* Statistics Cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card className="transition-all hover:shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                            <CardTitle className="text-sm font-medium">Total Pages</CardTitle>
                            <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900/20">
                                <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            </div>
                        </CardHeader>
                        <CardContent className="pb-3">
                            <div className="text-2xl font-bold">{statistics.total}</div>
                        </CardContent>
                    </Card>
                    <Card className="transition-all hover:shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                            <CardTitle className="text-sm font-medium">Published</CardTitle>
                            <div className="rounded-full bg-green-100 p-2 dark:bg-green-900/20">
                                <Globe className="h-4 w-4 text-green-600 dark:text-green-400" />
                            </div>
                        </CardHeader>
                        <CardContent className="pb-3">
                            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{statistics.published}</div>
                        </CardContent>
                    </Card>
                    <Card className="transition-all hover:shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                            <CardTitle className="text-sm font-medium">Drafts</CardTitle>
                            <div className="rounded-full bg-yellow-100 p-2 dark:bg-yellow-900/20">
                                <Edit className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                            </div>
                        </CardHeader>
                        <CardContent className="pb-3">
                            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{statistics.draft}</div>
                        </CardContent>
                    </Card>
                    <Card className="transition-all hover:shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                            <CardTitle className="text-sm font-medium">Archived</CardTitle>
                            <div className="rounded-full bg-gray-100 p-2 dark:bg-gray-900/20">
                                <Archive className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                            </div>
                        </CardHeader>
                        <CardContent className="pb-3">
                            <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">{statistics.archived}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card>
                    <CardContent className="pt-6">
                        <form onSubmit={handleSearch} className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-6 lg:items-end">
                                <div className="lg:col-span-2">
                                    <div className="relative">
                                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                                        <Input
                                            placeholder="Search pages..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-10"
                                        />
                                    </div>
                                </div>
                                <div className="lg:col-span-1">
                                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="All Statuses" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Statuses</SelectItem>
                                            {Object.entries(statuses).map(([value, label]) => (
                                                <SelectItem key={value} value={value}>
                                                    {label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="lg:col-span-1">
                                    <Select value={templateFilter} onValueChange={setTemplateFilter}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="All Templates" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Templates</SelectItem>
                                            {Object.entries(templates).map(([value, label]) => (
                                                <SelectItem key={value} value={value}>
                                                    {label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="lg:col-span-1">
                                    <Button type="submit" className="w-full">Filter</Button>
                                </div>
                                <div className="lg:col-span-1">
                                    <Button type="button" variant="outline" className="w-full" onClick={clearFilters}>
                                        Clear
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Bulk Actions */}
                {selectedPages.length > 0 && (
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                                <span className="text-sm text-muted-foreground">
                                    {selectedPages.length} page{selectedPages.length !== 1 ? 's' : ''} selected
                                </span>
                                <div className="flex flex-wrap gap-2">
                                    <Button size="sm" variant="outline" onClick={() => handleBulkAction('publish')}>
                                        Publish
                                    </Button>
                                    <Button size="sm" variant="outline" onClick={() => handleBulkAction('unpublish')}>
                                        Unpublish
                                    </Button>
                                    <Button size="sm" variant="outline" onClick={() => handleBulkAction('archive')}>
                                        Archive
                                    </Button>
                                    <Button size="sm" variant="destructive" onClick={() => handleBulkAction('delete')}>
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Pages Cards - Mobile */}
                <div className="space-y-4 md:hidden">
                    {pages.data.map((page) => (
                        <Card key={page.id} className="transition-all hover:shadow-md">
                            <CardContent className="p-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start space-x-3 flex-1">
                                        <Checkbox
                                            checked={selectedPages.includes(page.id)}
                                            onCheckedChange={(checked) => handleSelectPage(page.id, checked as boolean)}
                                            className="mt-1"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Link
                                                    href={admin.pages.edit(page.id)}
                                                    className="font-medium text-sm truncate hover:text-blue-600 transition-colors"
                                                >
                                                    {page.title}
                                                </Link>
                                                {getStatusBadge(page.status)}
                                            </div>
                                            <p className="text-xs text-muted-foreground mb-2 font-mono">/{page.slug}</p>
                                            {page.excerpt && (
                                                <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{page.excerpt}</p>
                                            )}
                                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                <div className="flex items-center gap-1">
                                                    <User className="h-3 w-3" />
                                                    {page.creator?.name || 'Unknown'}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    {formatDate(page.created_at)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem asChild>
                                                <Link href={admin.pages.edit(page.id)} className="flex items-center">
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Edit
                                                </Link>
                                            </DropdownMenuItem>
                                            {page.is_published && (
                                                <DropdownMenuItem asChild>
                                                    <a href={`/page/${page.slug}`} target="_blank" rel="noopener noreferrer" className="flex items-center">
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        View
                                                    </a>
                                                </DropdownMenuItem>
                                            )}
                                            <DropdownMenuItem onClick={() => handleDuplicate(page.id)} className="flex items-center">
                                                <Copy className="mr-2 h-4 w-4" />
                                                Duplicate
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            {page.status === 'published' ? (
                                                <DropdownMenuItem onClick={() => handleUnpublish(page.id)} className="flex items-center">
                                                    <Archive className="mr-2 h-4 w-4" />
                                                    Unpublish
                                                </DropdownMenuItem>
                                            ) : (
                                                <DropdownMenuItem onClick={() => handlePublish(page.id)} className="flex items-center">
                                                    <Globe className="mr-2 h-4 w-4" />
                                                    Publish
                                                </DropdownMenuItem>
                                            )}
                                            {page.status !== 'archived' && (
                                                <DropdownMenuItem onClick={() => handleArchive(page.id)} className="flex items-center">
                                                    <Archive className="mr-2 h-4 w-4" />
                                                    Archive
                                                </DropdownMenuItem>
                                            )}
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => handleDelete(page.id)} className="flex items-center text-destructive">
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Pages Table - Desktop */}
                <Card className="hidden md:block">
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-12">
                                        <Checkbox
                                            checked={selectedPages.length === pages.data.length && pages.data.length > 0}
                                            onCheckedChange={handleSelectAll}
                                        />
                                    </TableHead>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Template</TableHead>
                                    <TableHead>Author</TableHead>
                                    <TableHead>Created</TableHead>
                                    <TableHead>Updated</TableHead>
                                    <TableHead className="w-12"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pages.data.map((page) => (
                                    <TableRow key={page.id}>
                                        <TableCell>
                                            <Checkbox
                                                checked={selectedPages.includes(page.id)}
                                                onCheckedChange={(checked) => handleSelectPage(page.id, checked as boolean)}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <div className="font-medium">{page.title}</div>
                                                <div className="text-sm text-muted-foreground">/{page.slug}</div>
                                                {page.excerpt && (
                                                    <div className="mt-1 max-w-xs truncate text-xs text-muted-foreground">{page.excerpt}</div>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>{getStatusBadge(page.status)}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{templates[page.template] || page.template}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <User className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-sm">{page.creator?.name || 'Unknown'}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-sm">{formatDate(page.created_at)}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-sm">{formatDate(page.updated_at)}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem asChild>
                                                        <Link href={admin.pages.edit(page.id)}>
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            View
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild>
                                                        <Link href={admin.pages.edit(page.id)}>
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            Edit
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleDuplicate(page.id)}>
                                                        <Copy className="mr-2 h-4 w-4" />
                                                        Duplicate
                                                    </DropdownMenuItem>
                                                    {page.is_published && (
                                                        <DropdownMenuItem asChild>
                                                            <a href={pages.show(page.slug).url} target="_blank" rel="noopener noreferrer">
                                                                <Globe className="mr-2 h-4 w-4" />
                                                                View Live
                                                            </a>
                                                        </DropdownMenuItem>
                                                    )}
                                                    <DropdownMenuSeparator />
                                                    {page.status === 'published' ? (
                                                        <DropdownMenuItem onClick={() => handleUnpublish(page.id)}>Unpublish</DropdownMenuItem>
                                                    ) : (
                                                        <DropdownMenuItem onClick={() => handlePublish(page.id)}>Publish</DropdownMenuItem>
                                                    )}
                                                    {page.status !== 'archived' && (
                                                        <DropdownMenuItem onClick={() => handleArchive(page.id)}>
                                                            <Archive className="mr-2 h-4 w-4" />
                                                            Archive
                                                        </DropdownMenuItem>
                                                    )}
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        onClick={() => handleDelete(page.id)}
                                                        className="text-destructive focus:text-destructive"
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Pagination */}
                {pages.last_page > 1 && (
                    <Card>
                        <CardContent className="py-4">
                            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                                <div className="text-sm text-muted-foreground">
                                    Showing {((pages.current_page - 1) * pages.per_page) + 1} to {Math.min(pages.current_page * pages.per_page, pages.total)} of {pages.total} pages
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={pages.current_page <= 1}
                                        onClick={() => router.get(admin.pages.index().url, {
                                            ...filters,
                                            page: pages.current_page - 1
                                        })}
                                        className="h-8 w-8 p-0"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>

                                    {/* Page numbers */}
                                    {Array.from({ length: Math.min(5, pages.last_page) }, (_, i) => {
                                        let pageNum;
                                        if (pages.last_page <= 5) {
                                            pageNum = i + 1;
                                        } else {
                                            const start = Math.max(1, pages.current_page - 2);
                                            const end = Math.min(pages.last_page, start + 4);
                                            pageNum = start + i;
                                            if (pageNum > end) return null;
                                        }

                                        return (
                                            <Button
                                                key={pageNum}
                                                variant={pages.current_page === pageNum ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => router.get(admin.pages.index().url, {
                                                    ...filters,
                                                    page: pageNum
                                                })}
                                                className="h-8 w-8 p-0"
                                            >
                                                {pageNum}
                                            </Button>
                                        );
                                    })}

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={pages.current_page >= pages.last_page}
                                        onClick={() => router.get(admin.pages.index().url, {
                                            ...filters,
                                            page: pages.current_page + 1
                                        })}
                                        className="h-8 w-8 p-0"
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Bulk Action Confirmation Dialog */}
            <AlertDialog open={showBulkDialog} onOpenChange={setShowBulkDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Bulk Action</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to {bulkAction} {selectedPages.length} selected page{selectedPages.length !== 1 ? 's' : ''}?
                            {bulkAction === 'delete' && ' This action cannot be undone.'}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmBulkAction}
                            className={bulkAction === 'delete' ? 'bg-destructive hover:bg-destructive/90' : ''}
                        >
                            Confirm
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

export default function IndexWithLayout() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Index />
        </AppLayout>
    );
}
