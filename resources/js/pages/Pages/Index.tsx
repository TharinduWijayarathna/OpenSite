import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import pages from '@/routes/pages';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight, Calendar, FileText } from 'lucide-react';

interface Page {
    id: number;
    title: string;
    slug: string;
    excerpt?: string;
    template: string;
    published_at: string;
    created_at: string;
    creator?: {
        id: number;
        name: string;
    };
}

interface PaginationData {
    data: Page[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    prev_page_url?: string;
    next_page_url?: string;
}

interface PagesIndexProps {
    pages: PaginationData;
}

export default function Index() {
    const { pages: pagesData } = usePage<PagesIndexProps>().props;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const getTemplateLabel = (template: string) => {
        const labels: Record<string, string> = {
            default: 'Page',
            landing: 'Landing',
            blog: 'Article',
            portfolio: 'Portfolio',
            contact: 'Contact',
        };

        return labels[template] || template;
    };

    return (
        <>
            <Head title="Pages" />

            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <div className="border-b bg-white">
                    <div className="container mx-auto px-4 py-8">
                        <div className="text-center">
                            <h1 className="mb-4 text-4xl font-bold text-gray-900">Our Pages</h1>
                            <p className="mx-auto max-w-2xl text-xl text-gray-600">Discover our collection of pages and content</p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="container mx-auto px-4 py-12">
                    {pagesData.data.length === 0 ? (
                        <div className="py-16 text-center">
                            <FileText className="mx-auto mb-4 h-16 w-16 text-gray-400" />
                            <h2 className="mb-2 text-2xl font-semibold text-gray-900">No Pages Found</h2>
                            <p className="text-gray-600">There are currently no published pages to display.</p>
                        </div>
                    ) : (
                        <>
                            {/* Pages Grid */}
                            <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                                {pagesData.data.map((page) => (
                                    <Card key={page.id} className="transition-shadow duration-300 hover:shadow-lg">
                                        <CardHeader>
                                            <div className="mb-2 flex items-start justify-between">
                                                <Badge variant="outline" className="text-xs">
                                                    {getTemplateLabel(page.template)}
                                                </Badge>
                                                <div className="flex items-center text-sm text-gray-500">
                                                    <Calendar className="mr-1 h-4 w-4" />
                                                    {formatDate(page.published_at || page.created_at)}
                                                </div>
                                            </div>
                                            <CardTitle className="mb-3 text-xl">
                                                <Link href={pages.show(page.slug).url} className="transition-colors hover:text-blue-600">
                                                    {page.title}
                                                </Link>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            {page.excerpt && <p className="mb-4 line-clamp-3 text-gray-600">{page.excerpt}</p>}

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center text-sm text-gray-500">
                                                    {page.creator && (
                                                        <>
                                                            <span>by {page.creator.name}</span>
                                                        </>
                                                    )}
                                                </div>
                                                <Button variant="outline" size="sm" asChild>
                                                    <Link href={pages.show(page.slug).url}>
                                                        Read More
                                                        <ArrowRight className="ml-2 h-4 w-4" />
                                                    </Link>
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            {/* Pagination */}
                            {pagesData.last_page > 1 && (
                                <div className="flex items-center justify-center gap-4">
                                    {pagesData.prev_page_url && (
                                        <Button variant="outline" asChild>
                                            <Link href={pagesData.prev_page_url}>Previous</Link>
                                        </Button>
                                    )}

                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-600">
                                            Page {pagesData.current_page} of {pagesData.last_page}
                                        </span>
                                    </div>

                                    {pagesData.next_page_url && (
                                        <Button variant="outline" asChild>
                                            <Link href={pagesData.next_page_url}>Next</Link>
                                        </Button>
                                    )}
                                </div>
                            )}

                            {/* Results Info */}
                            <div className="mt-8 text-center">
                                <p className="text-sm text-gray-600">
                                    Showing {(pagesData.current_page - 1) * pagesData.per_page + 1} to{' '}
                                    {Math.min(pagesData.current_page * pagesData.per_page, pagesData.total)} of {pagesData.total} pages
                                </p>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
