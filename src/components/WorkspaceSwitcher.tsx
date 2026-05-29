import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  User,
  Wallet,
  HelpCircle,
  Settings,
  Shield,
  Check,
  Building2,
  Users,
  Eye,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import { useMember } from "@/hooks/useMember";
import { useAuth } from "@/hooks/useAuth";
import { useGFunnel } from "@/hooks/useGFunnel";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface WorkspaceSwitcherProps {
  workspaceLabel?: string;
}

const WORKSPACES = [
  { id: "sales", label: "Sales Hub" },
  { id: "cs", label: "Customer Success" },
  { id: "onboarding", label: "Onboarding" },
];

interface TeamProfile {
  id: string;
  member_id: string | null;
  full_name: string | null;
  manager_id: string | null;
  is_active: boolean;
}

export const WorkspaceSwitcher = ({ workspaceLabel = "Sales Hub" }: WorkspaceSwitcherProps) => {
  const { member, lookupMember } = useMember();
  const { user, isAdmin } = useAuth();
  const { context: gfunnelContext } = useGFunnel("saleshub");
  const { toast } = useToast();
  const [team, setTeam] = useState<TeamProfile[]>([]);

  const displayName =
    gfunnelContext?.user_display_name ||
    member?.full_name ||
    user?.email ||
    "Guest";
  const avatarUrl = gfunnelContext?.user_avatar_url ?? member?.avatar_url ?? undefined;
  const audienceLabel = (member as { audience?: string } | null)?.audience;
  const initials =
    displayName
      .split(/[\s@]+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((s) => s[0]?.toUpperCase())
      .join("") || "U";

  // Load team. Admins see everyone; members see their direct reps.
  useEffect(() => {
    const load = async () => {
      if (!isAdmin && !member) {
        setTeam([]);
        return;
      }
      let query = supabase
        .from("profiles")
        .select("id, member_id, full_name, manager_id, is_active")
        .eq("is_active", true);

      if (!isAdmin && member) {
        query = query.eq("manager_id", member.id);
      }

      const { data, error } = await query.order("full_name", { ascending: true });
      if (!error && data) setTeam(data as TeamProfile[]);
    };
    load();
  }, [isAdmin, member?.id]);

  const managers = team.filter((p) => !p.manager_id);
  const repsByManager = (managerId: string) => team.filter((p) => p.manager_id === managerId);
  const myReps = member ? team.filter((p) => p.manager_id === member.id) : [];

  const handleViewAs = async (memberId: string | null) => {
    if (!memberId) {
      toast({ title: "Cannot view", description: "This member has no ID set.", variant: "destructive" });
      return;
    }
    const { error } = await lookupMember(memberId);
    if (error) {
      toast({ title: "Switch failed", description: error, variant: "destructive" });
    } else {
      toast({ title: "Viewing as", description: memberId });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-muted"
          aria-label="Workspace settings"
        >
          <Settings className="w-5 h-5 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72 bg-popover">
        <DropdownMenuLabel className="font-normal">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 ring-2 ring-primary/20">
              <AvatarImage src={avatarUrl} alt={displayName} />
              <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-0.5 min-w-0">
              <p className="text-sm font-semibold truncate">{displayName}</p>
              <p className="text-[11px] text-muted-foreground truncate">{workspaceLabel}</p>
            </div>
          </div>
        </DropdownMenuLabel>
        {member?.member_id && (
          <DropdownMenuLabel className="font-normal pt-0">
            <p className="text-xs text-muted-foreground font-mono">ID: {member.member_id}</p>
          </DropdownMenuLabel>
        )}

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

        {/* My Team / All Team */}
        {(isAdmin || myReps.length > 0) && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-[11px] uppercase tracking-wider text-muted-foreground flex items-center gap-1">
              <Users className="w-3 h-3" /> {isAdmin ? "All Team" : "My Team"}
            </DropdownMenuLabel>

            {isAdmin ? (
              managers.length === 0 ? (
                <p className="px-2 py-1.5 text-xs text-muted-foreground">No managers yet.</p>
              ) : (
                managers.map((mgr) => {
                  const reps = repsByManager(mgr.id);
                  return (
                    <DropdownMenuSub key={mgr.id}>
                      <DropdownMenuSubTrigger className="cursor-pointer">
                        <Shield className="w-4 h-4 mr-2 text-primary" />
                        <span className="flex-1 truncate">{mgr.full_name || mgr.member_id}</span>
                        <span className="text-[10px] text-muted-foreground mr-1">{reps.length}</span>
                      </DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent className="w-56 bg-popover">
                          <DropdownMenuItem
                            onClick={() => handleViewAs(mgr.member_id)}
                            className="cursor-pointer"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View as {mgr.full_name || mgr.member_id}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuLabel className="text-[10px] uppercase tracking-wider text-muted-foreground">
                            Reps
                          </DropdownMenuLabel>
                          {reps.length === 0 ? (
                            <p className="px-2 py-1.5 text-xs text-muted-foreground">No reps assigned.</p>
                          ) : (
                            reps.map((rep) => (
                              <DropdownMenuItem
                                key={rep.id}
                                onClick={() => handleViewAs(rep.member_id)}
                                className="cursor-pointer"
                              >
                                <User className="w-4 h-4 mr-2" />
                                <span className="flex-1 truncate">{rep.full_name || rep.member_id}</span>
                                <Eye className="w-3 h-3 text-muted-foreground" />
                              </DropdownMenuItem>
                            ))
                          )}
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>
                  );
                })
              )
            ) : (
              myReps.map((rep) => (
                <DropdownMenuItem
                  key={rep.id}
                  onClick={() => handleViewAs(rep.member_id)}
                  className="cursor-pointer"
                >
                  <User className="w-4 h-4 mr-2" />
                  <span className="flex-1 truncate">{rep.full_name || rep.member_id}</span>
                  <Eye className="w-3 h-3 text-muted-foreground" />
                </DropdownMenuItem>
              ))
            )}
          </>
        )}

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
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
