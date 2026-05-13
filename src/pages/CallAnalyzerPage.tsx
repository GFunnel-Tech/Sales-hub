import CallAnalyzer from "@/components/CallAnalyzer";
import { SalesHubNavigation } from "@/components/SalesHubNavigation";

export default function CallAnalyzerPage() {
  return (
    <div className="min-h-screen bg-muted/30">
      <SalesHubNavigation />
      <main className="container mx-auto max-w-4xl">
        <CallAnalyzer />
      </main>
    </div>
  );
}
