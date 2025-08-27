<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Page;
use App\Models\User;
use Carbon\Carbon;

class PageSeeder extends Seeder
{
    /**
     * Run the database seeder.
     */
    public function run(): void
    {
        // Get the first user or create one for testing
        $user = User::first();
        if (!$user) {
            $user = User::create([
                'name' => 'Admin User',
                'email' => 'admin@example.com',
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
            ]);
        }

        // Sample pages with different templates and statuses
        $pages = [
            [
                'title' => 'Welcome to Our Website',
                'slug' => 'welcome',
                'excerpt' => 'Discover what makes us special and learn about our mission, values, and commitment to excellence.',
                'content' => "Welcome to our amazing website!\n\nWe're thrilled to have you here. Our platform is designed to provide you with the best possible experience while exploring our content and services.\n\nOur Mission\n\nWe believe in creating meaningful connections and delivering value through innovative solutions. Our team works tirelessly to ensure that every interaction you have with us is positive and productive.\n\nWhat We Offer\n\n- Exceptional service quality\n- Innovative solutions\n- Dedicated customer support\n- Continuous improvement\n\nGet Started Today\n\nReady to begin your journey with us? Explore our pages, discover our services, and don't hesitate to reach out if you have any questions. We're here to help you succeed!",
                'status' => 'published',
                'template' => 'landing',
                'sort_order' => 100,
                'published_at' => Carbon::now()->subDays(7),
                'meta_data' => [
                    'title' => 'Welcome - Your Gateway to Excellence',
                    'description' => 'Discover what makes us special and learn about our mission, values, and commitment to excellence.',
                    'keywords' => 'welcome, mission, values, excellence, innovation'
                ]
            ],
            [
                'title' => 'About Our Company',
                'slug' => 'about',
                'excerpt' => 'Learn about our history, our team, and the values that drive everything we do.',
                'content' => "Our Story\n\nFounded in 2020, our company has grown from a small startup with big dreams to a recognized leader in our industry. We started with a simple mission: to make a positive impact through innovative solutions and exceptional service.\n\nOur Team\n\nOur diverse team of professionals brings together decades of experience, fresh perspectives, and a shared commitment to excellence. We believe that our people are our greatest asset, and we're proud of the culture we've built together.\n\nCore Values\n\nIntegrity: We conduct our business with the highest ethical standards.\nInnovation: We continuously seek new and better ways to serve our customers.\nCollaboration: We work together to achieve common goals.\nExcellence: We strive for excellence in everything we do.\n\nLooking Forward\n\nAs we continue to grow and evolve, we remain committed to our founding principles while embracing new opportunities and challenges. The future is bright, and we're excited to share it with you.",
                'status' => 'published',
                'template' => 'default',
                'sort_order' => 90,
                'published_at' => Carbon::now()->subDays(5),
                'meta_data' => [
                    'title' => 'About Us - Our Story and Values',
                    'description' => 'Learn about our history, our team, and the values that drive everything we do.',
                    'keywords' => 'about, company, history, team, values, mission'
                ]
            ],
            [
                'title' => 'Getting Started with Dynamic Pages',
                'slug' => 'getting-started-dynamic-pages',
                'excerpt' => 'A comprehensive guide to understanding and using our dynamic page system effectively.',
                'content' => "Introduction\n\nOur dynamic page system allows you to create, manage, and publish content with ease. This guide will walk you through the key features and best practices.\n\nKey Features\n\n- Multiple template options\n- SEO optimization tools\n- Content scheduling\n- Version control\n- Analytics integration\n\nCreating Your First Page\n\n1. Navigate to the admin panel\n2. Click 'Create New Page'\n3. Choose your template\n4. Add your content\n5. Configure SEO settings\n6. Publish or schedule\n\nBest Practices\n\nContent Quality: Always focus on providing valuable, well-written content that serves your audience's needs.\n\nSEO Optimization: Use descriptive titles, meta descriptions, and relevant keywords to improve search engine visibility.\n\nTemplate Selection: Choose the template that best fits your content type and purpose.\n\nRegular Updates: Keep your content fresh and relevant by updating it regularly.\n\nTesting: Always preview your pages before publishing to ensure they look and function as expected.\n\nConclusion\n\nWith these tools and guidelines, you're ready to create compelling, effective pages that engage your audience and achieve your goals.",
                'status' => 'published',
                'template' => 'blog',
                'sort_order' => 80,
                'published_at' => Carbon::now()->subDays(3),
                'meta_data' => [
                    'title' => 'Getting Started with Dynamic Pages - Complete Guide',
                    'description' => 'A comprehensive guide to understanding and using our dynamic page system effectively.',
                    'keywords' => 'dynamic pages, guide, tutorial, cms, content management'
                ]
            ],
            [
                'title' => 'Our Latest Project Portfolio',
                'slug' => 'latest-project-portfolio',
                'excerpt' => 'Showcasing our most recent work and the innovative solutions we\'ve delivered for our clients.',
                'content' => "Project Overview\n\nThis showcase represents our latest work in web development, design, and digital strategy. Each project demonstrates our commitment to quality, innovation, and client satisfaction.\n\nTechnical Implementation\n\nTechnology Stack:\n- Laravel 12 for backend development\n- React 18 with TypeScript for frontend\n- Inertia.js for seamless SPA experience\n- Tailwind CSS for modern styling\n- MySQL for data persistence\n\nKey Features Delivered:\n\n- Dynamic content management system\n- Advanced user authentication\n- Real-time data synchronization\n- Mobile-responsive design\n- SEO optimization\n- Performance optimization\n\nClient Feedback\n\n\"The team exceeded our expectations in every way. The solution they delivered not only met our requirements but provided additional value we hadn't even considered.\"\n\nProject Outcomes\n\n- 40% increase in user engagement\n- 60% improvement in page load times\n- 100% mobile responsiveness achieved\n- SEO rankings improved significantly\n\nLessons Learned\n\nThis project reinforced the importance of thorough planning, clear communication, and iterative development. The collaborative approach with our client ensured that the final product truly met their needs and exceeded their expectations.",
                'status' => 'published',
                'template' => 'portfolio',
                'sort_order' => 70,
                'published_at' => Carbon::now()->subDays(1),
                'meta_data' => [
                    'title' => 'Latest Project Portfolio - Recent Work Showcase',
                    'description' => 'Showcasing our most recent work and the innovative solutions we\'ve delivered for our clients.',
                    'keywords' => 'portfolio, projects, web development, laravel, react, showcase'
                ]
            ],
            [
                'title' => 'Contact Us',
                'slug' => 'contact',
                'excerpt' => 'Get in touch with our team. We\'re here to answer your questions and help you succeed.',
                'content' => "We'd love to hear from you!\n\nWhether you have questions about our services, need support, or want to discuss a potential project, our team is ready to help.\n\nOffice Hours\nMonday - Friday: 9:00 AM - 6:00 PM\nSaturday: 10:00 AM - 4:00 PM\nSunday: Closed\n\nResponse Times\nWe typically respond to all inquiries within 24 hours during business days. For urgent matters, please call our direct line.\n\nWhat to Expect\nWhen you contact us, you can expect:\n- Prompt, professional responses\n- Detailed answers to your questions\n- Follow-up communication as needed\n- Respectful, courteous service\n\nWe look forward to connecting with you!",
                'status' => 'published',
                'template' => 'contact',
                'sort_order' => 60,
                'published_at' => Carbon::now()->subHours(12),
                'meta_data' => [
                    'title' => 'Contact Us - Get in Touch',
                    'description' => 'Get in touch with our team. We\'re here to answer your questions and help you succeed.',
                    'keywords' => 'contact, support, help, questions, team'
                ]
            ],
            [
                'title' => 'Privacy Policy Draft',
                'slug' => 'privacy-policy-draft',
                'excerpt' => 'Our commitment to protecting your privacy and personal information.',
                'content' => "Privacy Policy\n\nEffective Date: [To be determined]\n\nThis is a draft version of our privacy policy. We are currently reviewing and updating our privacy practices to ensure full compliance with applicable regulations.\n\nData Collection\nWe collect information that you provide directly to us, such as when you create an account, make a purchase, or contact us for support.\n\nData Usage\nWe use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you.\n\nData Protection\nWe implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.\n\nYour Rights\nYou have the right to access, update, or delete your personal information. You may also opt out of certain communications from us.\n\nContact Information\nIf you have questions about this privacy policy, please contact us at privacy@example.com.\n\nNote: This is a draft document and is subject to change before final publication.",
                'status' => 'draft',
                'template' => 'default',
                'sort_order' => 50,
                'published_at' => null,
                'meta_data' => [
                    'title' => 'Privacy Policy - Data Protection Commitment',
                    'description' => 'Our commitment to protecting your privacy and personal information.',
                    'keywords' => 'privacy, policy, data protection, personal information'
                ]
            ],
            [
                'title' => 'Legacy Content Archive',
                'slug' => 'legacy-content-archive',
                'excerpt' => 'Historical content that is no longer actively maintained but preserved for reference.',
                'content' => "Legacy Content Notice\n\nThis page contains historical content that is no longer actively maintained. While the information may still be valuable for reference purposes, please be aware that it may not reflect current practices, policies, or offerings.\n\nContent Overview\n\nThis archive includes:\n- Previous service descriptions\n- Outdated product information\n- Historical company updates\n- Legacy documentation\n\nImportant Note\n\nFor the most current and accurate information, please refer to our active pages or contact our team directly.\n\nPreservation Purpose\n\nWe maintain this archive to:\n- Preserve institutional knowledge\n- Provide historical context\n- Support research and analysis\n- Maintain transparency\n\nIf you're looking for current information, we recommend visiting our main pages or using our search function to find up-to-date content.",
                'status' => 'archived',
                'template' => 'default',
                'sort_order' => 10,
                'published_at' => Carbon::now()->subMonths(6),
                'meta_data' => [
                    'title' => 'Legacy Content Archive - Historical Reference',
                    'description' => 'Historical content that is no longer actively maintained but preserved for reference.',
                    'keywords' => 'legacy, archive, historical, reference, outdated'
                ]
            ]
        ];

        foreach ($pages as $pageData) {
            $pageData['created_by'] = $user->id;
            $pageData['updated_by'] = $user->id;
            Page::create($pageData);
        }

        $this->command->info('Created ' . count($pages) . ' sample pages with different templates and statuses.');
    }
}
