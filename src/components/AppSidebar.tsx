'use client';

import {
  Book,
  Calculator,
  GraduationCap,
  Languages,
  Laptop,
  ShieldCheck,
  LogOut,
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
import { useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useUser } from '@/firebase';

export default function AppSidebar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const { role, isLoading: isRoleLoading } = useUserRole();
  const auth = useAuth();

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/');
  };
  
  // Don't render sidebar on login page
  if (pathname === '/') {
    return <>{children}</>;
  }

  const menuItems = [
    { href: '/euskera', icon: <Book />, label: 'Euskera' },
    { href: '/matematika', icon: <Calculator />, label: 'Matematika' },
    { href: '/gaztelania', icon: <Languages />, label: 'Gaztelania' },
    { href: '/informatika', icon: <Laptop />, label: 'Informatika' },
  ];

  const adminMenuItems = [
    { href: '/irakasleak', icon: <ShieldCheck />, label: 'Irakasleak' },
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
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith(item.href)}
                >
                  <Link href={item.href}>{item.icon}{item.label}</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
            {role === 'admin' && (
              <>
                <SidebarSeparator />
                {adminMenuItems.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname.startsWith(item.href)}
                    >
                      <Link href={item.href}>{item.icon}{item.label}</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </>
            )}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
           <SidebarSeparator />
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
            {/* You can add a page title here if needed */}
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
