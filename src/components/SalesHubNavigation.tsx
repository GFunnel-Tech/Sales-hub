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
  { name: "Process", href: "/sales-process", icon: Target },
  { name: "Log Sale", href: "/log-sale", icon: PhoneCall },
  { name: "My Sales", href: "/my-sales", icon: ClipboardList },
  { name: "Scripts", href: "/scripts", icon: FileText },
  { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
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
    <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Workspace + User Switcher */}
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand */}
          <Link to="/" className="text-sm font-semibold text-foreground truncate">
            Sales Hub
          </Link>

            {primaryNav.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </Link>
            ))}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={`h-auto gap-1.5 px-3 py-2 text-sm font-medium ${
                    moreNav.some((i) => isActive(i.href))
                      ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <MoreHorizontal className="w-4 h-4" />
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
                      <item.icon className="w-4 h-4 mr-2" />
                      {item.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Spacer for layout balance */}
          <div className="hidden md:block w-8" />


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
