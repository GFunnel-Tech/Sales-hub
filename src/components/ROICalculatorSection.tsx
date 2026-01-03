import { useState, useEffect } from "react";
import { BusinessMetrics } from "@/lib/schemas";
import { budgetTiers, calculateTierMetrics, TierCalculations } from "@/lib/calculators";
import { industryPresets } from "@/lib/industryPresets";
import { BusinessMetricsForm } from "./BusinessMetricsForm";
import { CalculatorResults } from "./CalculatorResults";
import { Calculator } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
export const ROICalculatorSection = () => {
  const [results, setResults] = useState<TierCalculations[] | null>(null);
  const handleCalculate = (metrics: BusinessMetrics) => {
    const calculations = budgetTiers.map(tier => calculateTierMetrics(tier, metrics));
    setResults(calculations);

    // Scroll to results
    setTimeout(() => {
      const resultsElement = document.getElementById("calculator-results");
      if (resultsElement) {
        resultsElement.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    }, 100);
  };
  return <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-6">
        

        <div className="max-w-4xl mx-auto mb-16">
          <BusinessMetricsForm onCalculate={handleCalculate} />
        </div>

        {results && <div id="calculator-results" className="scroll-mt-20">
            <CalculatorResults results={results} />
          </div>}
      </div>
    </section>;
};