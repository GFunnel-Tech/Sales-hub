import { useState } from "react";
import { Shield, Search, ExternalLink, Building2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface CompetitorInfo {
  name: string;
  website: string;
  strengths: string[];
  weaknesses: string[];
  pricing: string;
}

const competitorDatabase: Record<string, CompetitorInfo> = {
  "competitor-a": {
    name: "Competitor A",
    website: "https://example.com/a",
    strengths: ["Low pricing", "Fast onboarding"],
    weaknesses: ["Limited support", "No custom integrations"],
    pricing: "$99/mo",
  },
  "competitor-b": {
    name: "Competitor B",
    website: "https://example.com/b",
    strengths: ["Enterprise features", "Global presence"],
    weaknesses: ["Complex UI", "Long contracts"],
    pricing: "$299/mo",
  },
};

export const CompetitorLookup = () => {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<CompetitorInfo | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = () => {
    setSearched(true);
    const key = Object.keys(competitorDatabase).find((k) =>
      k.toLowerCase().includes(query.toLowerCase()) ||
      competitorDatabase[k].name.toLowerCase().includes(query.toLowerCase())
    );
    setResult(key ? competitorDatabase[key] : null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Shield className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-bold">Competitor Lookup</h2>
          <p className="text-sm text-muted-foreground">Research competitors quickly during calls</p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search competitor name..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="pl-9"
              />
            </div>
            <Button onClick={handleSearch}>
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {searched && result && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Building2 className="w-5 h-5 text-primary" />
                <CardTitle>{result.name}</CardTitle>
              </div>
              <Button variant="outline" size="sm" asChild>
                <a href={result.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                  <ExternalLink className="w-3 h-3" />
                  Website
                </a>
              </Button>
            </div>
            <CardDescription>Pricing: {result.pricing}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold mb-2 text-green-600">Strengths</h4>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                {result.strengths.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-2 text-red-500">Weaknesses</h4>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                {result.weaknesses.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {searched && !result && (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">No competitor found matching "{query}"</p>
            <p className="text-xs text-muted-foreground mt-1">Try a different search term</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
