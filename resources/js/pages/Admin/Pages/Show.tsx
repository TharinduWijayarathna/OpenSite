import React from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import admin from '@/routes/admin';
import pages from '@/routes/pages';
import { type BreadcrumbItem } from '@/types';
import {
  ArrowLeft,
  Edit,
  Eye,
  Globe,
  Calendar,
  User,
  FileText,
  Search,
  Settings,
  Copy,
  Trash2,
  Archive,
} from 'lucide-react';
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
  meta_title?: string;
  meta_description?: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Pages',
        href: admin.pages.index().url,
    },
    {
        title: 'View Page',
    },
];

interface ShowPageProps {
  page: Page;
}

function Show() {
  const { page } = usePage<ShowPageProps>().props;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      published: 'default',
      draft: 'secondary',
      archived: 'outline',
    };

    const labels: Record<string, string> = {
      published: 'Published',
      draft: 'Draft',
      archived: 'Archived',
    };

    return (
      <Badge variant={variants[status] || 'secondary'}>
        {labels[status] || status}
      </Badge>
    );
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

  const renderContent = (content: string) => {
    // Simple line break preservation for display
    return content.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index < content.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  return (
    <>
      <Head title={`View: ${page.title}`} />

      <div className="container mx-auto py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href={admin.pages.index().url}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Pages
              </Link>
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold">{page.title}</h1>
                {getStatusBadge(page.status)}
              </div>
              <p className="text-muted-foreground">
                Created {formatDate(page.created_at)}
                {page.creator && ` by ${page.creator.name}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {page.is_published && (
              <Button variant="outline" size="sm" asChild>
                <a href={pages.show(page.slug).url} target="_blank" rel="noopener noreferrer">
                  <Globe className="w-4 h-4 mr-2" />
                  View Live
                </a>
              </Button>
            )}

            <Button variant="outline" size="sm" asChild>
              <a href={`/page/${page.slug}`} target="_blank" rel="noopener noreferrer">
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </a>
            </Button>

            <Button variant="outline" size="sm" asChild>
              <Link href={admin.pages.edit(page.id).url}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Link>
            </Button>

            <Button variant="outline" size="sm" onClick={handleDuplicate}>
              <Copy className="w-4 h-4 mr-2" />
              Duplicate
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Page Content */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Content
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {page.excerpt && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Excerpt</h3>
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-muted-foreground italic">
                        {renderContent(page.excerpt)}
                      </p>
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-semibold mb-2">Main Content</h3>
                  <div className="prose max-w-none p-4 border rounded-lg">
                    {renderContent(page.content)}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* SEO & Meta Data */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  SEO & Meta Data
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Meta Title</Label>
                    <p className="mt-1">{page.meta_data?.title || page.title}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Meta Keywords</Label>
                    <p className="mt-1">{page.meta_data?.keywords || 'Not set'}</p>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Meta Description</Label>
                  <p className="mt-1">{page.meta_data?.description || page.excerpt || 'Not set'}</p>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-3">Search Engine Preview</h4>
                  <div className="border rounded-lg p-4">
                    <h3 className="text-lg font-medium text-blue-600 hover:text-blue-800 cursor-pointer">
                      {page.meta_data?.title || page.title}
                    </h3>
                    <p className="text-sm text-green-700">
                      {window.location.origin}/page/{page.slug}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {page.meta_data?.description || page.excerpt || 'No description available.'}
                    </p>
                  </div>
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
                  <Globe className="w-5 h-5" />
                  Actions
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
                    <Archive className="w-4 h-4 mr-2" />
                    Archive
                  </Button>
                )}

                <Separator />

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Page
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
                      <AlertDialogAction
                        onClick={handleDelete}
                        className="bg-destructive hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>

            {/* Page Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                    <div className="mt-1">{getStatusBadge(page.status)}</div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Template</Label>
                    <p className="mt-1 capitalize">{page.template}</p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Sort Order</Label>
                    <p className="mt-1">{page.sort_order}</p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">URL Slug</Label>
                    <p className="mt-1 font-mono text-sm bg-muted px-2 py-1 rounded">
                      /{page.slug}
                    </p>
                  </div>

                  {page.published_at && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Published Date</Label>
                      <p className="mt-1">{formatDate(page.published_at)}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Page Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Page ID:</span>
                  <span className="font-mono">#{page.id}</span>
                </div>

                <Separator />

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created:</span>
                  <span>{formatDate(page.created_at)}</span>
                </div>

                {page.creator && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Created by:</span>
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      <span>{page.creator.name}</span>
                    </div>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last updated:</span>
                  <span>{formatDate(page.updated_at)}</span>
                </div>

                {page.updater && page.updater.id !== page.creator?.id && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Updated by:</span>
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      <span>{page.updater.name}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Content length:</span>
                  <span>{page.content.length} characters</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Word count:</span>
                  <span>~{Math.ceil(page.content.split(/\s+/).length)} words</span>
                </div>

                {page.excerpt && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Excerpt length:</span>
                    <span>{page.excerpt.length} characters</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Public URL:</span>
                  <Badge variant="outline" className="text-xs">
                    {page.is_published ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}

function Label({ children, className = '', ...props }: { children: React.ReactNode; className?: string }) {
  return (
    <label className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`} {...props}>
      {children}
    </label>
  );
}

export default function ShowWithLayout() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Show />
        </AppLayout>
    );
}
