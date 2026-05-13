import { SalesHubNavigation } from "@/components/SalesHubNavigation";
import { CompetitorLookup } from "@/components/CompetitorLookup";

export default function CompetitorLookupPage() {
  return (
    <div className="min-h-screen bg-muted/30">
      <SalesHubNavigation />
      <main className="container mx-auto px-6 md:px-12 lg:px-16 py-8">
        <CompetitorLookup />
      </main>
    </div>
  );
}
