import CompetitorLookup from "@/components/CompetitorLookup";
import { SalesHubNavigation } from "@/components/SalesHubNavigation";

export default function CompetitorLookupPage() {
  return (
    <div className="min-h-screen bg-muted/30">
      <SalesHubNavigation />
      <main className="container mx-auto max-w-4xl">
        <CompetitorLookup />
      </main>
    </div>
  );
}
