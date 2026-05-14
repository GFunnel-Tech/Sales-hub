import { Link, useNavigate } from "react-router-dom";
import { ChevronsUpDown, User, Wallet, HelpCircle, LogOut, Settings, Shield, Check, Building2 } from "lucide-react";
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

interface WorkspaceSwitcherProps {
  workspaceLabel?: string;
}

const WORKSPACES = [
  { id: "sales", label: "Sales Hub" },
  { id: "cs", label: "Customer Success" },
  { id: "onboarding", label: "Onboarding" },
];

export const WorkspaceSwitcher = ({ workspaceLabel = "Sales Hub" }: WorkspaceSwitcherProps) => {
  const { member, clearMember } = useMember();
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  const displayName = member?.full_name || user?.email || "Guest";
  const audienceLabel = (member as { audience?: string } | null)?.audience;
  const initials =
    displayName
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
        <Button
          variant="ghost"
          className="h-12 px-2 gap-2 hover:bg-muted -ml-2"
        >
          <Avatar className="h-8 w-8 ring-2 ring-primary/20">
            <AvatarImage src={member?.avatar_url ?? undefined} alt={displayName} />
            <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="hidden sm:flex flex-col items-start leading-tight">
            <span className="text-sm font-semibold text-foreground truncate max-w-[140px]">
              {workspaceLabel}
            </span>
            <span className="text-[11px] text-muted-foreground truncate max-w-[140px]">
              {displayName}
            </span>
          </div>
          <ChevronsUpDown className="w-4 h-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-72 bg-popover">
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
        <DropdownMenuLabel className="text-[11px] uppercase tracking-wider text-muted-foreground">
          Workspaces
        </DropdownMenuLabel>
        {WORKSPACES.map((ws) => {
          const active = ws.label === workspaceLabel;
          return (
            <DropdownMenuItem key={ws.id} className="cursor-pointer">
              <Building2 className="w-4 h-4 mr-2" />
              <span className="flex-1">{ws.label}</span>
              {active && <Check className="w-4 h-4 text-primary" />}
            </DropdownMenuItem>
          );
        })}

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
        <DropdownMenuItem
          onClick={handleSignOut}
          className="cursor-pointer text-destructive focus:text-destructive"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
