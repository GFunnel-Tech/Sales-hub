import { useState, useCallback, useEffect, memo } from "react";
import { Search, User, Building2, X, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { memberApi } from "@/lib/memberApi";
import { cn } from "@/lib/utils";

interface LeadData {
  id: string;
  prospectName: string;
  companyName?: string;
  email?: string;
  phone?: string;
  source: 'sales' | 'blueprint';
  lastContact?: string;
  status?: string;
}

interface LeadLookupProps {
  onSelectLead: (lead: LeadData) => void;
  onClear: () => void;
  className?: string;
}

export const LeadLookup = memo(function LeadLookup({ 
  onSelectLead, 
  onClear,
  className 
}: LeadLookupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [leads, setLeads] = useState<LeadData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentLeads, setRecentLeads] = useState<LeadData[]>([]);

  // Load recent leads on mount
  useEffect(() => {
    const loadRecentLeads = async () => {
      try {
        const [salesRes, blueprintRes] = await Promise.all([
          memberApi.searchSalesLeads("").catch(() => ({ leads: [] })),
          memberApi.searchBlueprintLeads("").catch(() => ({ leads: [] })),
        ]);

        const salesLeads: LeadData[] = (salesRes.leads || []).slice(0, 5).map((s: any) => ({
          id: s.id,
          prospectName: `${s.customer_first_name || ''} ${s.customer_last_name || ''}`.trim(),
          email: s.customer_email || undefined,
          phone: s.customer_phone || undefined,
          source: 'sales' as const,
          lastContact: s.created_at,
          status: s.disposition,
        }));

        const blueprintLeads: LeadData[] = (blueprintRes.leads || []).slice(0, 5).map((b: any) => ({
          id: b.id,
          prospectName: b.prospect_name,
          companyName: b.prospect_company || undefined,
          email: b.prospect_email || undefined,
          source: 'blueprint' as const,
          lastContact: b.created_at || undefined,
          status: b.status || undefined,
        }));

        const allLeads = [...salesLeads, ...blueprintLeads];
        const seen = new Set<string>();
        const unique = allLeads.filter(l => {
          const key = l.prospectName.toLowerCase();
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });

        setRecentLeads(unique.slice(0, 5));
      } catch (error) {
        console.error('Error loading recent leads:', error);
      }
    };

    loadRecentLeads();
  }, []);

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setLeads([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const [salesRes, blueprintRes] = await Promise.all([
          memberApi.searchSalesLeads(searchQuery).catch(() => ({ leads: [] })),
          memberApi.searchBlueprintLeads(searchQuery).catch(() => ({ leads: [] })),
        ]);

        const salesLeads: LeadData[] = (salesRes.leads || []).map((s: any) => ({
          id: s.id,
          prospectName: `${s.customer_first_name || ''} ${s.customer_last_name || ''}`.trim(),
          email: s.customer_email || undefined,
          phone: s.customer_phone || undefined,
          source: 'sales' as const,
          lastContact: s.created_at,
          status: s.disposition,
        }));

        const blueprintLeads: LeadData[] = (blueprintRes.leads || []).map((b: any) => ({
          id: b.id,
          prospectName: b.prospect_name,
          companyName: b.prospect_company || undefined,
          email: b.prospect_email || undefined,
          source: 'blueprint' as const,
          lastContact: b.created_at || undefined,
          status: b.status || undefined,
        }));

        setLeads([...salesLeads, ...blueprintLeads]);
      } catch (error) {
        console.error('Error searching leads:', error);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSelectLead = useCallback((lead: LeadData) => {
    onSelectLead(lead);
    setIsOpen(false);
    setSearchQuery("");
  }, [onSelectLead]);

  const handleClear = useCallback(() => {
    onClear();
    setSearchQuery("");
  }, [onClear]);

  const displayLeads = searchQuery.trim() ? leads : recentLeads;

  return (
    <Card className={cn("mb-4", className)}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button 
            variant="ghost" 
            className="w-full justify-between h-auto py-3 px-4"
          >
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Lead Lookup</span>
            </div>
            <Badge variant="outline" className="text-xs">
              {isOpen ? "Close" : "Search existing leads"}
            </Badge>
          </Button>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="pt-0 pb-4">
            <div className="flex gap-2 mb-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button variant="outline" size="icon" onClick={handleClear}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            {isLoading ? (
              <div className="text-center py-4 text-sm text-muted-foreground">
                Searching...
              </div>
            ) : displayLeads.length > 0 ? (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground mb-2">
                  {searchQuery.trim() ? "Search Results" : "Recent Leads"}
                </p>
                {displayLeads.map((lead) => (
                  <button
                    key={`${lead.source}-${lead.id}`}
                    onClick={() => handleSelectLead(lead)}
                    className="w-full text-left p-3 rounded-md border hover:bg-accent transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <User className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span className="font-medium truncate">{lead.prospectName}</span>
                      </div>
                      <Badge variant="secondary" className="text-xs shrink-0">
                        {lead.source === 'blueprint' ? 'Blueprint' : 'Sale'}
                      </Badge>
                    </div>
                    <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                      {lead.companyName && (
                        <span className="flex items-center gap-1">
                          <Building2 className="h-3 w-3" />
                          {lead.companyName}
                        </span>
                      )}
                      {lead.email && <span>{lead.email}</span>}
                      {lead.lastContact && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(lead.lastContact).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            ) : searchQuery.trim() ? (
              <div className="text-center py-4 text-sm text-muted-foreground">
                No leads found. Start fresh with a new prospect.
              </div>
            ) : (
              <div className="text-center py-4 text-sm text-muted-foreground">
                Search for an existing lead or start fresh.
              </div>
            )}

            <Button 
              variant="outline" 
              className="w-full mt-3"
              onClick={handleClear}
            >
              Start Fresh
            </Button>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
});
