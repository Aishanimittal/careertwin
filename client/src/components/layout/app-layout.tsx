import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarHeader,
  SidebarFooter
} from "@/components/ui/sidebar";
import { LayoutDashboard, User, Code, History, LogOut, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AppLayout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const { logout, user } = useAuth();

  const navigation = [
    { title: "Dashboard", url: "/", icon: LayoutDashboard },
    { title: "Profile", url: "/profile", icon: User },
    { title: "My Skills", url: "/skills", icon: Code },
    { title: "History", url: "/history", icon: History },
  ];

  return (
    <SidebarProvider>
      <div className="relative flex min-h-screen w-full overflow-hidden bg-background/40">
        <div className="pointer-events-none absolute -top-20 left-8 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-8 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />
        <Sidebar variant="inset" className="z-10 border-r border-border/60 bg-card/70 backdrop-blur-xl">
          <SidebarHeader className="p-6">
            <Link href="/" className="classic-hover flex items-center gap-3 transition-opacity hover:opacity-90">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-sky-700 shadow-lg shadow-primary/20 transition-transform duration-300 hover:rotate-3">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="font-display text-xl font-bold tracking-tight text-foreground">
                CareerTwin
              </span>
            </Link>
          </SidebarHeader>
          <SidebarContent className="px-4">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Navigation
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigation.map((item) => (
                    <SidebarMenuItem key={item.title} className="mb-1">
                      <SidebarMenuButton 
                        asChild 
                        isActive={location === item.url}
                        className="rounded-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/10 hover:shadow-sm data-[active=true]:bg-primary/15 data-[active=true]:text-primary data-[active=true]:font-semibold"
                      >
                        <Link href={item.url} className="flex items-center gap-3 px-3 py-2.5">
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="p-4 border-t border-border/50">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 px-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary font-bold uppercase">
                  {user?.name?.charAt(0) || user?.username.charAt(0) || 'U'}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium leading-none">{user?.name || user?.username}</span>
                  <span className="text-xs text-muted-foreground mt-1">Free Plan</span>
                </div>
              </div>
              <Button 
                variant="ghost" 
                className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10" 
                onClick={() => logout()}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="z-10 flex min-w-0 flex-1 flex-col overflow-hidden">
          <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border/40 bg-background/75 px-6 backdrop-blur-md">
            <SidebarTrigger className="-ml-2 hover:bg-accent/50" />
            <div className="flex-1" />
          </header>
          <div className="animate-in-fade flex-1 overflow-y-auto p-6 md:p-8 lg:p-10">
            <div className="mx-auto max-w-6xl w-full">
              {children}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
