import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import admin from '@/routes/admin';
import pages from '@/routes/pages';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Archive, BarChart3, Edit, Eye, FileText, Globe, Plus, TrendingUp } from 'lucide-react';

interface DashboardProps {
    pageStats?: {
        total: number;
        published: number;
        draft: number;
        archived: number;
    };
    recentPages?: Array<{
        id: number;
        title: string;
        slug: string;
        status: string;
        created_at: string;
        updated_at: string;
        creator?: {
            name: string;
        };
    }>;
    [key: string]: any;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard() {
    const { pageStats, recentPages } = usePage<DashboardProps>().props;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const getStatusBadge = (status: string) => {
        const variants: Record<string, 'default' | 'secondary' | 'outline'> = {
            published: 'default',
            draft: 'secondary',
            archived: 'outline',
        };

        const labels: Record<string, string> = {
            published: 'Published',
            draft: 'Draft',
            archived: 'Archived',
        };

        return <Badge variant={variants[status] || 'secondary'}>{labels[status] || status}</Badge>;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex-1 space-y-4 p-4 md:p-6 lg:p-8">
                {/* Welcome Section */}
                <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Dashboard</h1>
                        <p className="text-sm text-muted-foreground sm:text-base">
                            Welcome back! Here's what's happening with your site.
                        </p>
                    </div>
                    <Button size="default" className="w-full sm:w-auto" asChild>
                        <Link href={admin.pages.create()}>
                            <Plus className="mr-2 h-4 w-4" />
                            Create Page
                        </Link>
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card className="transition-all hover:shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                            <CardTitle className="text-sm font-medium">Total Pages</CardTitle>
                            <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900/20">
                                <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            </div>
                        </CardHeader>
                        <CardContent className="pb-3">
                            <div className="text-2xl font-bold">{pageStats?.total || 0}</div>
                            <p className="text-xs text-muted-foreground mt-1">All content pages</p>
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
                            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                {pageStats?.published || 0}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">Live on your site</p>
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
                            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                                {pageStats?.draft || 0}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">In progress</p>
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
                            <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                                {pageStats?.archived || 0}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">No longer active</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content Grid */}
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Recent Pages */}
                    <Card className="lg:col-span-2">
                        <CardHeader className="pb-4">
                            <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <div className="rounded-full bg-blue-100 p-1.5 dark:bg-blue-900/20">
                                        <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    Recent Pages
                                </CardTitle>
                                <Button variant="outline" size="sm" className="w-full sm:w-auto" asChild>
                                    <Link href={admin.pages.index()}>View All</Link>
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                            {recentPages && recentPages.length > 0 ? (
                                <div className="space-y-4">
                                    {recentPages.slice(0, 5).map((page, index) => (
                                        <div key={page.id}>
                                            <div className="flex items-center justify-between gap-4">
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-3">
                                                        <Link
                                                            href={admin.pages.edit(page.id)}
                                                            className="truncate text-sm font-medium hover:text-blue-600 transition-colors"
                                                        >
                                                            {page.title}
                                                        </Link>
                                                        {getStatusBadge(page.status)}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground mt-1">
                                                        Created {formatDate(page.created_at)}
                                                        {page.creator && ` by ${page.creator.name}`}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1 flex-shrink-0">
                                                    <Button variant="ghost" size="sm" asChild>
                                                        <Link href={admin.pages.edit(page.id)}>
                                                            <Edit className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                    {page.status === 'published' && (
                                                        <Button variant="ghost" size="sm" asChild>
                                                            <a href={pages.show(page.slug).url} target="_blank" rel="noopener noreferrer">
                                                                <Eye className="h-4 w-4" />
                                                            </a>
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                            {index < recentPages.slice(0, 5).length - 1 && <Separator className="mt-4" />}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-12 text-center">
                                    <div className="rounded-full bg-gray-100 p-3 w-12 h-12 mx-auto mb-4 dark:bg-gray-900">
                                        <FileText className="h-6 w-6 text-muted-foreground mx-auto" />
                                    </div>
                                    <h3 className="mb-2 font-semibold text-base">No pages yet</h3>
                                    <p className="mb-4 text-sm text-muted-foreground max-w-sm mx-auto">
                                        Get started by creating your first page
                                    </p>
                                    <Button asChild>
                                        <Link href={admin.pages.create()}>
                                            <Plus className="mr-2 h-4 w-4" />
                                            Create Page
                                        </Link>
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Quick Actions */}
                        <Card>
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <div className="rounded-full bg-green-100 p-1.5 dark:bg-green-900/20">
                                        <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                                    </div>
                                    Quick Actions
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 pt-0">
                                <Button className="w-full justify-start h-11" asChild>
                                    <Link href={admin.pages.create()}>
                                        <Plus className="mr-3 h-4 w-4" />
                                        Create New Page
                                    </Link>
                                </Button>
                                <Button variant="outline" className="w-full justify-start h-11" asChild>
                                    <Link href={admin.pages.index()}>
                                        <FileText className="mr-3 h-4 w-4" />
                                        Manage Pages
                                    </Link>
                                </Button>
                                <Button variant="outline" className="w-full justify-start h-11" asChild>
                                    <Link href={pages.index()}>
                                        <Globe className="mr-3 h-4 w-4" />
                                        View Public Site
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>

                        {/* System Overview */}
                        <Card>
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <div className="rounded-full bg-purple-100 p-1.5 dark:bg-purple-900/20">
                                        <BarChart3 className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    System Overview
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 pt-0">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Content Management</span>
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                        <span className="font-medium text-green-600 dark:text-green-400">Active</span>
                                    </div>
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Template System</span>
                                    <span className="font-medium">5 Templates</span>
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Last Update</span>
                                    <span className="font-medium">{formatDate(new Date().toISOString())}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
