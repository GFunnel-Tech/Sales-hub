import { ServiceConfig } from "@/lib/serviceConfigs";
import { VideoShowcase } from "./VideoShowcase";

interface ServiceHeroProps {
  service: ServiceConfig;
}

export const ServiceHero = ({ service }: ServiceHeroProps) => {
  const BadgeIcon = service.badgeIcon;

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary to-secondary text-primary-foreground py-14 md:py-20">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTItMTZ2Mmgydi0yaC0yem0wIDR2Mmgydi0yaC0yem0wIDR2Mmgydi0yaC0yem0wIDR2Mmgydi0yaC0yem0wIDR2Mmgydi0yaC0yem0tNCAwdjJoMnYtMmgtMnptLTQgMHYyaDJ2LTJoLTJ6bS00IDB2Mmgydi0yaC0yem0tNCAwdjJoMnYtMmgtMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-10 items-center max-w-7xl mx-auto">
          {/* Left Column - Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full mb-5 text-xs font-medium">
              <BadgeIcon className="w-3.5 h-3.5" />
              <span>{service.badgeText}</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5 leading-tight tracking-tight">
              {service.title}
            </h1>
            
            <p className="text-base md:text-lg mb-6 text-primary-foreground/90 leading-relaxed">
              {service.description}
            </p>

            {/* Key Stats */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {service.stats.map((stat, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                  <div className="text-xl md:text-2xl font-bold text-accent mb-0.5">{stat.value}</div>
                  <div className="text-[10px] text-primary-foreground/80 whitespace-nowrap overflow-hidden text-ellipsis">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Feature Pills */}
            <div className="hidden lg:grid lg:grid-cols-3 gap-3">
              {service.features.map((feature, index) => {
                const FeatureIcon = feature.icon;
                return (
                  <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                    <FeatureIcon className="w-5 h-5 mb-1.5 text-accent" />
                    <h3 className="font-medium text-xs mb-0.5">{feature.title}</h3>
                    <p className="text-[10px] text-primary-foreground/80">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column - Video */}
          <div className="w-full">
            <VideoShowcase videos={service.videos} />
          </div>
        </div>
      </div>
    </section>
  );
};