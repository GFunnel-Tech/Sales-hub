import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import { learningTopics } from "@/lib/learningConfig";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-14">
          {/* Left side - Home link */}
          <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Learning Hub
          </Link>
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1">
                  Programs
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 max-h-[400px] overflow-y-auto bg-popover">
                <DropdownMenuItem asChild>
                  <Link to="/learning-hub" className="cursor-pointer font-medium text-accent">
                    Learning Hub
                  </Link>
                </DropdownMenuItem>
                {learningTopics.map((topic) => (
                  <DropdownMenuItem key={topic.slug} asChild>
                  <Link to={`/learning-hub/${topic.slug}`} className="cursor-pointer text-sm">
                      {topic.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="gradient" size="sm" asChild>
              <a href="https://www.gfunnel.com/discover" target="_parent" rel="noopener noreferrer">
                Start Learning
              </a>
            </Button>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] overflow-y-auto">
                <div className="flex flex-col gap-3 mt-6">
                  <h3 className="font-semibold text-base mb-2">Learning Topics</h3>
                  <Link
                    to="/learning-hub"
                    className="text-accent font-medium text-sm hover:underline py-1.5"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Learning Hub
                  </Link>
                  {learningTopics.map((topic) => (
                    <Link
                      key={topic.slug}
                      to={`/learning-hub/${topic.slug}`}
                      className="text-muted-foreground hover:text-foreground transition-colors py-1.5 text-sm"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {topic.name}
                    </Link>
                  ))}
                  <Button variant="gradient" size="sm" className="mt-4" asChild>
                    <a href="https://www.gfunnel.com/discover" target="_parent" rel="noopener noreferrer">
                      Start Learning
                    </a>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};