import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, ExternalLink, Home, FileText, PlusCircle, List, BookOpen, LogOut, User, Video, RefreshCw } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useMember } from "@/hooks/useMember";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navItems = [
  { name: "Hub", href: "/", icon: Home },
  { name: "Process", href: "/sales-process", icon: FileText },
  { name: "Log Sale", href: "/log-sale", icon: PlusCircle },
  { name: "My Sales", href: "/my-sales", icon: List },
  { name: "Scripts", href: "/scripts", icon: BookOpen },
  { name: "Objections", href: "/objection-playbook", icon: FileText },
  { name: "Training", href: "/sales-training", icon: BookOpen },
];

export const SalesNavigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { member, clearMember } = useMember();

  const isActive = (href: string) => location.pathname === href;

  const handleSwitchMember = () => {
    clearMember();
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/dashboard" className="font-bold text-lg text-foreground">
            Sales Hub
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
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
          </div>

          {/* Right side actions */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="outline" asChild>
              <a 
                href="https://meet.google.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <Video className="w-4 h-4" />
                Google Meet
                <ExternalLink className="w-3 h-3" />
              </a>
            </Button>
            
            {member && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                    <div className="text-left hidden sm:block">
                      <p className="text-sm font-medium">{member.full_name || member.member_id}</p>
                      <p className="text-xs text-muted-foreground">{member.member_id}</p>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{member.full_name || "Team Member"}</p>
                    <p className="text-xs text-muted-foreground">ID: {member.member_id}</p>
                    {member.email && (
                      <p className="text-xs text-muted-foreground">{member.email}</p>
                    )}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSwitchMember}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Switch Member
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
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
                {member && (
                  <div className="flex items-center gap-3 mt-4 p-3 bg-muted rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{member.full_name || member.member_id}</p>
                      <p className="text-xs text-muted-foreground">ID: {member.member_id}</p>
                    </div>
                  </div>
                )}
                
                <div className="flex flex-col gap-2 mt-6">
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
                  
                  <div className="mt-4 pt-4 border-t border-border space-y-2">
                    <Button variant="outline" className="w-full" asChild>
                      <a 
                        href="https://meet.google.com/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2"
                      >
                        <Video className="w-4 h-4" />
                        Google Meet
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </Button>
                    
                    {member && (
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start"
                        onClick={() => {
                          handleSwitchMember();
                          setMobileMenuOpen(false);
                        }}
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Switch Member
                      </Button>
                    )}
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
