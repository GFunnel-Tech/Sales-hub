import { useParams, Navigate } from "react-router-dom";
import { ServiceHero } from "@/components/ServiceHero";
import { ServiceFAQ } from "@/components/ServiceFAQ";
import { QuickActions } from "@/components/QuickActions";
import { RelatedServices } from "@/components/RelatedServices";
import { getServiceBySlug } from "@/lib/serviceConfigs";
import { getFAQsByServiceSlug } from "@/lib/serviceFAQs";
import { Navigation } from "@/components/Navigation";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Button } from "@/components/ui/button";

const ServicePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { ref: contentRef, isVisible: contentVisible } = useScrollAnimation(0.1);
  const { ref: ctaRef, isVisible: ctaVisible } = useScrollAnimation(0.1);
  
  if (!slug) {
    return <Navigate to="/" replace />;
  }

  const service = getServiceBySlug(slug);
  const faqs = getFAQsByServiceSlug(slug);

  if (!service) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen pb-24 lg:pb-0">
      <Navigation />
      <ServiceHero service={service} />

      <div 
        ref={contentRef}
        id="features-benefits" 
        className={`container mx-auto px-6 py-16 scroll-smooth-section transition-all duration-700 ${
          contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="max-w-7xl mx-auto">
          {/* Desktop Layout: Two columns */}
          <div className="hidden lg:grid lg:grid-cols-[1fr_380px] lg:gap-8">
            {/* Left Column: FAQ */}
            <div>
              <ServiceFAQ faqs={faqs} />
            </div>
            
            {/* Right Column: Quick Actions (sticky) */}
            <div className="space-y-6">
              <div className="sticky top-20">
                <QuickActions 
                  discoveryUrl={service.discoveryUrl}
                  quickActionContent={service.quickActionContent}
                />
              </div>
            </div>
          </div>

          {/* Mobile Layout: Stacked */}
          <div className="lg:hidden space-y-8">
            {/* Quick Actions First on Mobile */}
            <QuickActions 
              discoveryUrl={service.discoveryUrl}
              quickActionContent={service.quickActionContent}
            />
            
            {/* FAQ */}
            <ServiceFAQ faqs={faqs} />
          </div>
        </div>
      </div>

      <div 
        ref={ctaRef}
        className={`transition-all duration-700 delay-150 ${
          ctaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <RelatedServices currentServiceSlug={slug} />
      </div>

      {/* Mobile Quick Actions - Fixed Bottom */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 shadow-lg z-50">
        <Button 
          variant="gradient" 
          size="lg" 
          className="w-full"
          onClick={() => window.open(service.discoveryUrl, "_blank")}
        >
          Access Program
        </Button>
      </div>
    </div>
  );
};

export default ServicePage;
