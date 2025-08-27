import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavGroup, type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';

interface NavMainProps {
    items?: NavItem[];
    groups?: NavGroup[];
}

export function NavMain({ items = [], groups = [] }: NavMainProps) {
    const page = usePage();

    // Helper function to check if a route is active
    const isActive = (href: any): boolean => {
        const url = typeof href === 'string' ? href : href.url;
        return page.url.startsWith(url);
    };

    // Render navigation items
    const renderNavItems = (navItems: NavItem[]) =>
        navItems.map((item) => (
            <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild isActive={isActive(item.href)} tooltip={{ children: item.title }}>
                    <Link href={item.href} prefetch>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        ));

    // If groups are provided, render grouped navigation
    if (groups.length > 0) {
        return (
            <>
                {groups.map((group) => (
                    <SidebarGroup key={group.title} className="px-2 py-0">
                        <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
                        <SidebarMenu>{renderNavItems(group.items)}</SidebarMenu>
                    </SidebarGroup>
                ))}
            </>
        );
    }

    // Fallback to flat navigation for backward compatibility
    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>{renderNavItems(items)}</SidebarMenu>
        </SidebarGroup>
    );
}
