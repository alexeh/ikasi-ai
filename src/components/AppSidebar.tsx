'use client';

import {
  Book,
  Calculator,
  GraduationCap,
  Languages,
  Laptop,
  ShieldCheck,
  LogOut,
  Loader2,
  User as UserIcon,
  ChevronDown,
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
import { useEffect, useState } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';


const allowedUsers = [
  'jarambarri@aldapeta.eus',
  'alejandro.hernandez@aldapeta.eus',
  'alma.ruizdearcaute@aldapeta.eus',
  'amets.olaizola@aldapeta.eus',
  'daniel.irazusta@aldapeta.eus',
  'diego.valcarce@aldapeta.eus',
  'elia.virto@aldapeta.eus',
  'julen.povieda@aldapeta.eus',
  'lola.altolaguirre@aldapeta.eus',
  'lucia.benali@aldapeta.eus',
  'lucia.manzano@aldapeta.eus',
  'luis.oliveira@aldapeta.eus',
  'lukas.usarraga@aldapeta.eus',
  'manuela.demora@aldapeta.eus',
  'marina.ortuzar@aldapeta.eus',
  'martin.aizpurua@aldapeta.eus',
  'martin.ceceaga@aldapeta.eus',
  'martin.contreras@aldapeta.eus',
  'martin.cuenca@aldapeta.eus',
  'martin.garcia@aldapeta.eus',
  'martin.iturralde@aldapeta.eus',
  'oto.fermin@aldapeta.eus',
  'sara.padilla@aldapeta.eus',
  'simon.fernandez@aldapeta.eus',
];

const formatEmailToName = (email: string) => {
    const namePart = email.split('@')[0];
    return namePart.split('.').map(name => name.charAt(0).toUpperCase() + name.slice(1)).join(' ');
}

const formatEmailToId = (email: string) => {
    return email.replace(/[@.]/g, '_');
}


export default function AppSidebar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const { role, isLoading: isRoleLoading, email } = useUserRole();
  const auth = useAuth();
  const [isStatsOpen, setIsStatsOpen] = useState(pathname.startsWith('/irakasleak/estatistikak'));

  const students = allowedUsers
    .filter(email => email !== 'jarambarri@aldapeta.eus')
    .sort((a, b) => {
        const lastNameA = a.split('@')[0].split('.')[1] || a;
        const lastNameB = b.split('@')[0].split('.')[1] || b;
        return lastNameA.localeCompare(lastNameB);
    });

  useEffect(() => {
    // If we are not loading and the user is logged in, but we are on the login page,
    // redirect them to the main app area.
    if (!isUserLoading && user && pathname === '/') {
      router.push('/euskera');
    }
    // If we are not loading and there is NO user, but we are NOT on the login page,
    // force a redirect to the login page.
    if (!isUserLoading && !user && pathname !== '/') {
        router.push('/');
    }
  }, [user, isUserLoading, pathname, router]);

  const handleSignOut = async () => {
    // Also clear our simulated user from local storage
    localStorage.removeItem('simulated_user');
    if (auth) {
      await signOut(auth);
    }
    router.push('/');
  };
  
  // Don't render sidebar on login page
  if (pathname === '/') {
     // While loading auth state on the login page, show a loader.
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
                 <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname.startsWith('/irakasleak/ikasleak')}>
                        <Link href="/irakasleak/ikasleak"><UserIcon />Ikasleak</Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
              </>
            )}
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
