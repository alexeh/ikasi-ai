// src/components/AppSidebar.tsx
'use client';

import {
  Book,
  Calculator,
  GraduationCap,
  Languages,
  Laptop,
  LogOut,
  Loader2,
  User as UserIcon,
} from 'lucide-react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  SidebarFooter,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useUser } from '@/hooks/useUser';

const PUBLIC_ROUTES = ['/', '/signup'];

export default function AppSidebar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isUserLoading } = useUser();


  useEffect(() => {
    if (isUserLoading) return;


    if (user && PUBLIC_ROUTES.includes(pathname)) {
      router.push('/euskera');
      return;
    }

    if (!user && !PUBLIC_ROUTES.includes(pathname)) {
      router.push('/');
    }
  }, [user, isUserLoading, pathname, router]);

  const handleSignOut = async () => {
    console.log('Signing out...');
    try {
      await fetch('/api/auth/students/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch {}
    window.location.href = '/';
  };


  if (PUBLIC_ROUTES.includes(pathname)) {
    if (isUserLoading || user) {
      return (
          <div className="flex h-screen w-screen items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
      );
    }
    return <>{children}</>;
  }

  const menuItems = [
    { href: '/euskera', icon: <Book />, label: 'Euskera' },
    { href: '/matematika', icon: <Calculator />, label: 'Matematika' },
    { href: '/gaztelania', icon: <Languages />, label: 'Gaztelania' },
    { href: '/informatika', icon: <Laptop />, label: 'Informatika' },
  ];

  return (
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader>
            <Link href="/euskera" className="flex items-center gap-2">
              <GraduationCap className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-headline font-bold tracking-tight text-foreground">
                Ikasgela
              </h1>
            </Link>
          </SidebarHeader>

          <SidebarContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={pathname.startsWith(item.href)}>
                      <Link href={item.href}>
                        {item.icon}
                        {item.label}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter>
            <SidebarSeparator />
            {user?.email && (
                <div className="px-4 py-2 text-xs text-muted-foreground truncate">
                  <div className="flex items-center gap-2">
                    <UserIcon className="h-4 w-4" />
                    <span>{user.email}</span>
                  </div>
                </div>
            )}
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleSignOut}>
                  <LogOut />
                  Saioa Itxi
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset>
          <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-6">
            <SidebarTrigger className="md:hidden" />
            <div className="flex-1" />
          </header>

          {isUserLoading ? (
              <div className="flex flex-1 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
          ) : user ? (
              children
          ) : null}
        </SidebarInset>
      </SidebarProvider>
  );
}