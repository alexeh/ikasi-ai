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
  Users,
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
import { useUserRole } from '@/hooks/useUserRole';
import { useAuth, useUser } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useEffect } from 'react';

export default function AppSidebar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const { role, email, isLoading: isRoleLoading } = useUserRole();
  const auth = useAuth();
  
  useEffect(() => {
    if (!isUserLoading && user && pathname === '/') {
      router.push('/euskera');
    }
    if (!isUserLoading && !user && pathname !== '/') {
        router.push('/');
    }
  }, [user, isUserLoading, pathname, router]);

  const handleSignOut = async () => {
    localStorage.removeItem('simulated_user');
    if (auth) {
      await signOut(auth);
    }
    router.push('/');
  };
  
  if (pathname === '/') {
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
  
  const adminMenuItems = [
    { href: '/ikasleak', icon: <Users />, label: 'Ikasleak' },
  ]

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
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith(item.href)}
                >
                  <Link href={item.href}>{item.icon}{item.label}</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
            {role === 'admin' && <SidebarSeparator />}
            {role === 'admin' && adminMenuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                    asChild
                    isActive={pathname.startsWith(item.href)}
                    >
                    <Link href={item.href}>{item.icon}{item.label}</Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
           <SidebarSeparator />
            {email && (
              <div className="px-4 py-2 text-xs text-muted-foreground truncate">
                <div className="flex items-center gap-2">
                  <UserIcon className="h-4 w-4" />
                  <span>{email}</span>
                </div>
              </div>
            )}
           <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleSignOut}>
                  <LogOut/>
                  Saioa Itxi
                </SidebarMenuButton>
              </SidebarMenuItem>
           </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-6">
          <SidebarTrigger className="md:hidden" />
          <div className="flex-1">
          </div>
        </header>
        {isUserLoading || isRoleLoading ? (
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
