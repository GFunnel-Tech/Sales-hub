import { SalesHubNavigation } from "@/components/SalesHubNavigation";
import { CallAnalyzer } from "@/components/CallAnalyzer";

export default function CallAnalyzerPage() {
  return (
    <div className="min-h-screen bg-muted/30">
      <SalesHubNavigation />
      <main className="container mx-auto px-6 md:px-12 lg:px-16 py-8">
        <CallAnalyzer />
      </main>
    </div>
  );
}
