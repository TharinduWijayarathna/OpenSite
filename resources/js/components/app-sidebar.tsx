import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import admin from '@/routes/admin';
import pages from '@/routes/pages';
import { type NavGroup, type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BarChart3, BookOpen, FileText, Folder, Globe, LayoutGrid, Plus, Settings, Users } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
];

const contentNavItems: NavItem[] = [
    {
        title: 'All Pages',
        href: admin.pages.index(),
        icon: FileText,
    },
    {
        title: 'Create Page',
        href: admin.pages.create(),
        icon: Plus,
    },
    {
        title: 'Published Pages',
        href: pages.index(),
        icon: Globe,
    },
];

const systemNavItems: NavItem[] = [
    {
        title: 'Users',
        href: '/admin/users', // Placeholder for future user management
        icon: Users,
    },
    {
        title: 'Analytics',
        href: '/admin/analytics', // Placeholder for future analytics
        icon: BarChart3,
    },
    {
        title: 'Settings',
        href: '/admin/settings', // Placeholder for future admin settings
        icon: Settings,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

const navGroups: NavGroup[] = [
    {
        title: 'Overview',
        items: mainNavItems,
    },
    {
        title: 'Content Management',
        items: contentNavItems,
    },
    {
        title: 'System',
        items: systemNavItems,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain groups={navGroups} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
