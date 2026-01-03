import { getAllServices } from "@/lib/serviceConfigs";
import { ServiceCard } from "@/components/ServiceCard";
import { Navigation } from "@/components/Navigation";
import { HomeFAQ } from "@/components/HomeFAQ";
import { HomeCTA } from "@/components/HomeCTA";

const Index = () => {
  const services = getAllServices();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-20 px-6 md:px-12 lg:px-16 overflow-hidden">
        <div className="container mx-auto relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent/20 bg-accent/5">
              <span className="text-accent">🎓</span>
              <span className="text-sm font-medium tracking-widest uppercase text-accent">Learning Programs</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight">
              Business & Entrepreneur{" "}
              <span className="gradient-text">University</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Access courses, workshops, events, virtual summits, and live trainings designed to help you start and grow your business.
            </p>
          </div>
        </div>
      </section>

      {/* Programs Directory */}
      <section className="py-8 px-6 md:px-12 lg:px-16">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {services.map((service) => (
              <ServiceCard key={service.slug} service={service} />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <HomeFAQ />

      {/* CTA Section */}
      <HomeCTA />

    </div>
  );
};

export default Index;
