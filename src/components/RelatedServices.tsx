import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { getServiceBySlug } from "@/lib/serviceConfigs";
import { useNavigate } from "react-router-dom";

interface RelatedServicesProps {
  currentServiceSlug: string;
}

export const RelatedServices = ({ currentServiceSlug }: RelatedServicesProps) => {
  const navigate = useNavigate();
  const currentService = getServiceBySlug(currentServiceSlug);

  if (!currentService || !currentService.relatedServices || currentService.relatedServices.length === 0) {
    return null;
  }

  const relatedServices = currentService.relatedServices
    .map(slug => getServiceBySlug(slug))
    .filter(Boolean);

  if (relatedServices.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-6">
        <Card className="max-w-5xl mx-auto p-8 md:p-12 bg-gradient-to-br from-secondary/10 via-background to-primary/10 border-2 border-primary/20">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-2 rounded-full mb-4">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Services That Work Together</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Maximize Your Results
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Pair {currentService.name} with these complementary services to create a powerful, integrated solution for your business.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {relatedServices.map((service) => {
              const IconComponent = service.badgeIcon;
              return (
                <div 
                  key={service.slug}
                  className="flex flex-col items-center text-center p-6 bg-card rounded-lg border border-border hover:border-primary/50 transition-all cursor-pointer group"
                  onClick={() => navigate(`/${service.slug}`)}
                >
                  <div className="bg-primary/10 w-14 h-14 rounded-full flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                    <IconComponent className="w-7 h-7 text-primary" />
                  </div>
                  <div className="inline-flex items-center gap-1 bg-secondary/10 text-secondary px-2 py-1 rounded-full mb-2">
                    <span className="text-xs font-medium">{service.badgeText}</span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{service.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {service.description}
                  </p>
                  <div className="mt-auto">
                    <Button variant="ghost" size="sm" className="group-hover:bg-primary/10">
                      Learn More
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              Combine multiple services for a comprehensive business solution
            </p>
          </div>
        </Card>
      </div>
    </section>
  );
};
