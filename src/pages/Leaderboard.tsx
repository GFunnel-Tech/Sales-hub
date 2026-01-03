import { useState, useEffect } from "react";
import { PartnerNavigation } from "@/components/PartnerNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award, RefreshCw, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LeaderboardEntry {
  rank: number;
  name: string;
  partnerRank: string;
  earnings: string;
  referrals: number;
}

// Placeholder data - will be replaced by Google Sheets
const placeholderData: LeaderboardEntry[] = [
  { rank: 1, name: "Marcus T.", partnerRank: "Pioneer", earnings: "$22,500", referrals: 156 },
  { rank: 2, name: "Sarah M.", partnerRank: "Nomad", earnings: "$18,200", referrals: 89 },
  { rank: 3, name: "Jessica L.", partnerRank: "Maverick", earnings: "$14,800", referrals: 72 },
  { rank: 4, name: "David K.", partnerRank: "Nomad", earnings: "$12,100", referrals: 65 },
  { rank: 5, name: "Amanda R.", partnerRank: "Maverick", earnings: "$10,500", referrals: 58 },
  { rank: 6, name: "Michael P.", partnerRank: "Nomad", earnings: "$9,200", referrals: 45 },
  { rank: 7, name: "Jennifer W.", partnerRank: "Explorer", earnings: "$7,800", referrals: 38 },
  { rank: 8, name: "Robert C.", partnerRank: "Explorer", earnings: "$6,500", referrals: 32 },
  { rank: 9, name: "Lisa M.", partnerRank: "Explorer", earnings: "$5,200", referrals: 28 },
  { rank: 10, name: "James H.", partnerRank: "Explorer", earnings: "$4,100", referrals: 22 },
];

const rankEmoji: Record<string, string> = {
  "Explorer": "🌱",
  "Nomad": "✈️",
  "Maverick": "⚡",
  "Pioneer": "🌍",
  "Titan": "👑",
  "Legend": "💎",
};

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Trophy className="w-5 h-5 text-yellow-500" />;
    case 2:
      return <Medal className="w-5 h-5 text-gray-400" />;
    case 3:
      return <Award className="w-5 h-5 text-amber-600" />;
    default:
      return <span className="w-5 text-center font-bold text-muted-foreground">{rank}</span>;
  }
};

const getRowStyle = (rank: number) => {
  switch (rank) {
    case 1:
      return "leaderboard-rank-1";
    case 2:
      return "leaderboard-rank-2";
    case 3:
      return "leaderboard-rank-3";
    default:
      return "";
  }
};

export default function Leaderboard() {
  const [data, setData] = useState<LeaderboardEntry[]>(placeholderData);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [sheetUrl, setSheetUrl] = useState<string>("");

  // Function to fetch data from Google Sheets CSV
  const fetchLeaderboardData = async (csvUrl: string) => {
    if (!csvUrl) return;
    
    setLoading(true);
    try {
      const response = await fetch(csvUrl);
      const text = await response.text();
      
      // Parse CSV
      const lines = text.split('\n').filter(line => line.trim());
      const entries: LeaderboardEntry[] = [];
      
      // Skip header row (index 0)
      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(',').map(col => col.trim().replace(/"/g, ''));
        if (cols.length >= 4) {
          entries.push({
            rank: i,
            name: cols[0] || `Partner ${i}`,
            partnerRank: cols[1] || "Explorer",
            earnings: cols[2] || "$0",
            referrals: parseInt(cols[3]) || 0,
          });
        }
      }
      
      if (entries.length > 0) {
        setData(entries);
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error("Error fetching leaderboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      <PartnerNavigation />
      
      {/* Header */}
      <section className="py-12 md:py-16 border-b border-border">
        <div className="container mx-auto px-6 md:px-12 lg:px-16">
          <div className="max-w-3xl">
            <div className="eyebrow mb-4">
              <Trophy className="w-4 h-4" />
              Leaderboard
            </div>
            <h1 className="text-headline mb-4">Top Partners</h1>
            <p className="text-lg text-muted-foreground">
              See who's leading the pack. Updated regularly from partner performance data.
            </p>
          </div>
        </div>
      </section>

      {/* Leaderboard */}
      <section className="py-12">
        <div className="container mx-auto px-6 md:px-12 lg:px-16">
          <Tabs defaultValue="monthly" className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <TabsList className="h-auto p-1 bg-muted">
                <TabsTrigger value="monthly" className="py-2 px-4">
                  This Month
                </TabsTrigger>
                <TabsTrigger value="alltime" className="py-2 px-4">
                  All Time
                </TabsTrigger>
              </TabsList>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Updated: {lastUpdated.toLocaleDateString()}</span>
              </div>
            </div>

            <TabsContent value="monthly">
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Monthly Top 10</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {data.map((entry) => (
                      <div 
                        key={entry.rank} 
                        className={`leaderboard-row ${getRowStyle(entry.rank)}`}
                      >
                        <div className="flex items-center justify-center w-8">
                          {getRankIcon(entry.rank)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold truncate">{entry.name}</span>
                            <span className="text-lg">{rankEmoji[entry.partnerRank] || "🌱"}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{entry.partnerRank}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-success">{entry.earnings}</p>
                          <p className="text-xs text-muted-foreground">{entry.referrals} referrals</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="alltime">
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">All-Time Top 10</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {data.map((entry) => (
                      <div 
                        key={entry.rank} 
                        className={`leaderboard-row ${getRowStyle(entry.rank)}`}
                      >
                        <div className="flex items-center justify-center w-8">
                          {getRankIcon(entry.rank)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold truncate">{entry.name}</span>
                            <span className="text-lg">{rankEmoji[entry.partnerRank] || "🌱"}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{entry.partnerRank}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-success">{entry.earnings}</p>
                          <p className="text-xs text-muted-foreground">{entry.referrals} referrals</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

        </div>
      </section>

    </div>
  );
}
