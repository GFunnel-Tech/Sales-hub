import { getAllServices } from "@/lib/serviceConfigs";
import { ServiceCard } from "@/components/ServiceCard";
import { Navigation } from "@/components/Navigation";

const AllServices = () => {
  const services = getAllServices();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Service Directory - Cards Only */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {services.map((service) => (
              <ServiceCard key={service.slug} service={service} />
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default AllServices;
