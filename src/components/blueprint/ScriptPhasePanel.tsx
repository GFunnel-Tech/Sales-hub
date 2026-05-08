import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Target } from "lucide-react";
import type { ScriptPhase } from "@/lib/scriptTypes";

interface Props {
  blueprintPath: string;
}

interface Match {
  scriptTitle: string;
  phase: ScriptPhase;
}

export function ScriptPhasePanel({ blueprintPath }: Props) {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data } = await supabase
        .from("scripts")
        .select("title, content")
        .eq("is_active", true);
      if (!active) return;
      const found: Match[] = [];
      (data ?? []).forEach((s) => {
        const phases = (Array.isArray(s.content) ? s.content : []) as unknown as ScriptPhase[];
        phases.forEach((p) => {
          if (p?.blueprint_path === blueprintPath) {
            found.push({ scriptTitle: s.title, phase: p });
          }
        });
      });
      setMatches(found);
      setLoading(false);
    })();
    return () => { active = false; };
  }, [blueprintPath]);

  if (loading || matches.length === 0) return null;

  return (
    <div className="mb-6 space-y-3">
      {matches.map((m, i) => (
        <Card key={i} className="border-primary/30 bg-primary/5">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-primary" />
                {m.phase.name}
              </CardTitle>
              <Badge variant="outline" className="text-xs">{m.scriptTitle}</Badge>
            </div>
            {m.phase.goal && (
              <p className="text-xs text-muted-foreground flex items-start gap-1 mt-1">
                <Target className="h-3 w-3 mt-0.5 shrink-0" /> {m.phase.goal}
              </p>
            )}
          </CardHeader>
          <CardContent className="space-y-2 pt-0">
            <ScrollArea className="max-h-64">
              <div className="space-y-2">
                {m.phase.lines?.map((line, idx) => (
                  <p key={idx} className="text-sm leading-relaxed">{line}</p>
                ))}
              </div>
            </ScrollArea>
            {m.phase.objections && m.phase.objections.length > 0 && (
              <details className="text-xs mt-2">
                <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                  {m.phase.objections.length} objection responses
                </summary>
                <div className="mt-2 space-y-2">
                  {m.phase.objections.map((o, idx) => (
                    <div key={idx} className="border-l-2 border-primary/40 pl-2">
                      <p className="font-medium">"{o.objection}"</p>
                      <p className="text-muted-foreground">{o.response}</p>
                    </div>
                  ))}
                </div>
              </details>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
