import { Link, useNavigate } from "react-router-dom";
import { User, Wallet, HelpCircle, LogOut, Settings, Shield } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMember } from "@/hooks/useMember";
import { useAuth } from "@/hooks/useAuth";

interface AvatarMenuProps {
  className?: string;
}

export const AvatarMenu = ({ className }: AvatarMenuProps) => {
  const { member, clearMember } = useMember();
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  const displayName = member?.full_name || user?.email || "Guest";
  const audienceLabel = (member as { audience?: string } | null)?.audience;
  const initials = displayName
    .split(/[\s@]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("") || "U";

  const handleSignOut = async () => {
    if (user) await signOut();
    if (member) clearMember();
    navigate("/member-entry");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className={`rounded-full ${className ?? ""}`}>
          <Avatar className="h-9 w-9 ring-2 ring-primary/20">
            <AvatarImage src={member?.avatar_url ?? undefined} alt={displayName} />
            <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60 bg-popover">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col gap-0.5">
            <p className="text-sm font-semibold truncate">{displayName}</p>
            {audienceLabel && (
              <p className="text-xs text-muted-foreground capitalize">{audienceLabel}</p>
            )}
            {member?.member_id && (
              <p className="text-xs text-muted-foreground font-mono">ID: {member.member_id}</p>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/payouts" className="cursor-pointer">
            <Wallet className="w-4 h-4 mr-2" />
            My Payouts
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/my-sales" className="cursor-pointer">
            <User className="w-4 h-4 mr-2" />
            My Sales
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/settings" className="cursor-pointer">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Link>
        </DropdownMenuItem>
        {isAdmin && (
          <DropdownMenuItem asChild>
            <Link to="/admin" className="cursor-pointer">
              <Shield className="w-4 h-4 mr-2" />
              Admin Panel
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem asChild>
          <a
            href="https://help.gfunnel.com"
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 mr-2" />
            Help & Support
          </a>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive focus:text-destructive">
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
