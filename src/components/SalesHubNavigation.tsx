import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, Target, PhoneCall, ClipboardList, FileText, BarChart3, Shield, Mic2, FolderOpen, MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { WorkspaceSwitcher } from "./WorkspaceSwitcher";

const primaryNav = [
  { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
  { name: "Process", href: "/sales-process", icon: Target },
  { name: "Scripts", href: "/scripts", icon: FileText },
];

const moreNav = [
  { name: "Documents", href: "/documents", icon: FolderOpen },
  { name: "Competitors", href: "/competitor-lookup", icon: Shield },
  { name: "Call Analysis", href: "/call-analyzer", icon: Mic2 },
];

const navItems = [...primaryNav, ...moreNav];


export const SalesHubNavigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (href: string) => location.pathname === href;

  return (
    <nav className="sticky top-0 z-50 border-b border-border/80 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/90">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-16 items-center gap-3 lg:grid lg:grid-cols-[1fr_auto_1fr]">
          <div className="hidden lg:block" />

          <div className="hidden lg:flex flex-1 items-center justify-center">
            <div className="inline-flex items-center gap-1 rounded-full border border-border/80 bg-muted/40 p-1 shadow-sm">
              {primaryNav.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex h-10 items-center gap-2 rounded-full px-4 text-sm font-medium transition-all ${
                    isActive(item.href)
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-background hover:text-foreground"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              ))}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className={`h-10 rounded-full px-4 text-sm font-medium ${
                      moreNav.some((i) => isActive(i.href))
                        ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 hover:text-primary-foreground"
                        : "text-muted-foreground hover:bg-background hover:text-foreground"
                    }`}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                    More
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-popover">
                  {moreNav.map((item) => (
                    <DropdownMenuItem key={item.href} asChild>
                      <Link
                        to={item.href}
                        className={`cursor-pointer ${isActive(item.href) ? "bg-muted" : ""}`}
                      >
                        <item.icon className="mr-2 h-4 w-4" />
                        {item.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="hidden md:flex items-center justify-end lg:justify-self-end">
            <WorkspaceSwitcher workspaceLabel="Sales Hub" />
          </div>




          {/* Mobile Menu */}
          <div className="lg:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px]">
                <div className="flex flex-col gap-2 mt-8">
                  <Link
                    to="/"
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive("/")
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Home
                  </Link>
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                        isActive(item.href)
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <item.icon className="w-5 h-5" />
                      {item.name}
                    </Link>
                  ))}
                  <div className="mt-4 pt-4 border-t border-border px-2">
                    <WorkspaceSwitcher workspaceLabel="Sales Hub" />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};
