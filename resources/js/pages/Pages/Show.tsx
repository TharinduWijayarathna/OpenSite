import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import pages from '@/routes/pages';
import {
  Calendar,
  User,
  ArrowLeft,
  Share2,
  Clock,
  Tag,
  Globe,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react';

interface Page {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  template: string;
  published_at: string;
  created_at: string;
  creator?: {
    id: number;
    name: string;
  };
  meta_data?: {
    title?: string;
    description?: string;
    keywords?: string;
  };
  meta_title?: string;
  meta_description?: string;
}

interface ShowPageProps {
  page: Page;
  template: string;
}

export default function Show() {
  const { page, template } = usePage<ShowPageProps>().props;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderContent = (content: string) => {
    // Simple line break and paragraph handling
    return content.split('\n\n').map((paragraph, index) => (
      <p key={index} className="mb-4">
        {paragraph.split('\n').map((line, lineIndex) => (
          <React.Fragment key={lineIndex}>
            {line}
            {lineIndex < paragraph.split('\n').length - 1 && <br />}
          </React.Fragment>
        ))}
      </p>
    ));
  };

  const shareUrl = `${window.location.origin}/page/${page.slug}`;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: page.title,
        text: page.excerpt || page.meta_description,
        url: shareUrl,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareUrl);
    }
  };

  // Default Template
  const DefaultTemplate = () => (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <Button variant="ghost" size="sm" asChild>
                <Link href={pages.index().url}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Pages
                </Link>
              </Button>
            </div>

            <header className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{page.title}</h1>
              {page.excerpt && (
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">{page.excerpt}</p>
              )}

              <div className="flex items-center justify-center gap-4 mt-6 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {formatDate(page.published_at || page.created_at)}
                </div>
                {page.creator && (
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {page.creator.name}
                  </div>
                )}
                <Button variant="ghost" size="sm" onClick={handleShare}>
                  <Share2 className="w-4 h-4 mr-1" />
                  Share
                </Button>
              </div>
            </header>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-8">
              <div className="prose prose-lg max-w-none">
                {renderContent(page.content)}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  // Landing Page Template
  const LandingTemplate = () => (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">{page.title}</h1>
            {page.excerpt && (
              <p className="text-xl md:text-2xl mb-8 opacity-90">{page.excerpt}</p>
            )}
            <div className="flex justify-center gap-4">
              <Button size="lg" variant="secondary">
                Get Started
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-gray-900">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-lg max-w-none">
            {renderContent(page.content)}
          </div>
        </div>
      </div>
    </div>
  );

  // Blog Template
  const BlogTemplate = () => (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Button variant="ghost" size="sm" asChild>
              <Link href={pages.index().url}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Articles
              </Link>
            </Button>
          </div>

          <Card className="mb-8">
            <CardContent className="p-8">
              <header className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="outline">Article</Badge>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="w-4 h-4 mr-1" />
                    {Math.ceil(page.content.split(/\s+/).length / 200)} min read
                  </div>
                </div>

                <h1 className="text-4xl font-bold text-gray-900 mb-4">{page.title}</h1>

                {page.excerpt && (
                  <p className="text-xl text-gray-600 mb-6">{page.excerpt}</p>
                )}

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-4">
                    {page.creator && (
                      <div className="flex items-center gap-2">
                        <User className="w-5 h-5 text-gray-400" />
                        <span className="font-medium">{page.creator.name}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-gray-500">
                      <Calendar className="w-4 h-4" />
                      {formatDateTime(page.published_at || page.created_at)}
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleShare}>
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </header>

              <Separator className="mb-8" />

              <article className="prose prose-lg max-w-none">
                {renderContent(page.content)}
              </article>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  // Portfolio Template
  const PortfolioTemplate = () => (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <Button variant="ghost" size="sm" asChild>
              <Link href={pages.index().url}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Portfolio
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-8">
                  <header className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                      <Badge variant="outline">Portfolio</Badge>
                      <Tag className="w-4 h-4 text-gray-400" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">{page.title}</h1>
                    {page.excerpt && (
                      <p className="text-xl text-gray-600">{page.excerpt}</p>
                    )}
                  </header>

                  <div className="prose prose-lg max-w-none">
                    {renderContent(page.content)}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Project Details</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Created:</span>
                      <span>{formatDate(page.created_at)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Published:</span>
                      <span>{formatDate(page.published_at || page.created_at)}</span>
                    </div>
                    {page.creator && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Author:</span>
                        <span>{page.creator.name}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Share This Project</h3>
                  <Button onClick={handleShare} className="w-full">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Project
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Contact Template
  const ContactTemplate = () => (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{page.title}</h1>
            {page.excerpt && (
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">{page.excerpt}</p>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-semibold mb-6">Get In Touch</h2>
                <div className="prose max-w-none mb-8">
                  {renderContent(page.content)}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <span>contact@example.com</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <span>+1 (555) 123-4567</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <span>123 Business St, City, State 12345</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-semibold mb-6">Send a Message</h2>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="First Name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Last Name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Subject"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <textarea
                    placeholder="Your Message"
                    rows={5}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                  <Button type="submit" className="w-full">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );

  // Template selection
  const renderTemplate = () => {
    switch (template) {
      case 'landing':
        return <LandingTemplate />;
      case 'blog':
        return <BlogTemplate />;
      case 'portfolio':
        return <PortfolioTemplate />;
      case 'contact':
        return <ContactTemplate />;
      default:
        return <DefaultTemplate />;
    }
  };

  return (
    <>
      <Head title={page.meta_title || page.title}>
        <meta name="description" content={page.meta_description || page.excerpt} />
        {page.meta_data?.keywords && (
          <meta name="keywords" content={page.meta_data.keywords} />
        )}
        <meta property="og:title" content={page.meta_title || page.title} />
        <meta property="og:description" content={page.meta_description || page.excerpt} />
        <meta property="og:url" content={shareUrl} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={page.meta_title || page.title} />
        <meta name="twitter:description" content={page.meta_description || page.excerpt} />
      </Head>

      {renderTemplate()}
    </>
  );
}
