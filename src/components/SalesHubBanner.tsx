import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Target, Lightbulb, MessageCircle, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

const bannerSlides = [
  {
    id: 1,
    title: "Process Beats Pitch",
    description: "Master the ACE framework: Acquisition → Creation → Expansion. Build a repeatable system that scales.",
    cta: "Start Training",
    href: "/sales-training",
    icon: Lightbulb,
    gradient: "from-violet-600 via-purple-500 to-fuchsia-500",
    accentGradient: "from-pink-400 via-orange-300 to-yellow-400",
  },
  {
    id: 2,
    title: "Master the 7-Step Process",
    description: "From Handshake to Handoff — follow the proven methodology that achieves 70-90% conversion rates.",
    cta: "Start Process",
    href: "/sales-process",
    icon: Target,
    gradient: "from-blue-600 via-cyan-500 to-teal-400",
    accentGradient: "from-emerald-400 via-teal-300 to-cyan-400",
  },
  {
    id: 3,
    title: "Handle Any Objection",
    description: "Learn the Isolate → Accept → Create → Expand loop to turn 'no' into 'yes'.",
    cta: "View Playbook",
    href: "/objection-playbook",
    icon: MessageCircle,
    gradient: "from-orange-500 via-amber-500 to-yellow-400",
    accentGradient: "from-rose-400 via-pink-400 to-purple-400",
  },
  {
    id: 4,
    title: "Dream → Pain → Obstacle",
    description: "Surface burning desires with the DPO questioning framework. Pain determines price.",
    cta: "Learn More",
    href: "/sales-process",
    icon: Heart,
    gradient: "from-rose-500 via-pink-500 to-purple-500",
    accentGradient: "from-violet-400 via-indigo-400 to-blue-400",
  },
];

export function SalesHubBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
  }, []);

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="relative w-full h-[280px] md:h-[320px] rounded-2xl overflow-hidden shadow-xl">
      {/* Slides */}
      {bannerSlides.map((slide, index) => {
        const Icon = slide.icon;
        return (
          <div
            key={slide.id}
            className={cn(
              "absolute inset-0 transition-all duration-700 ease-in-out",
              index === currentSlide 
                ? "opacity-100 translate-x-0" 
                : index < currentSlide 
                  ? "opacity-0 -translate-x-full"
                  : "opacity-0 translate-x-full"
            )}
          >
            {/* Background Gradient */}
            <div className={cn("absolute inset-0 bg-gradient-to-br", slide.gradient)} />
            
            {/* Decorative Elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div 
                className={cn(
                  "absolute -right-20 -top-20 w-[600px] h-[600px] rounded-full bg-gradient-to-br opacity-40 blur-3xl",
                  slide.accentGradient
                )}
              />
              <div 
                className={cn(
                  "absolute right-1/4 top-1/2 w-[300px] h-[300px] rounded-full bg-gradient-to-tr opacity-30 blur-2xl",
                  slide.accentGradient
                )}
              />
              <div 
                className={cn(
                  "absolute right-10 bottom-10 w-[150px] h-[150px] rounded-full bg-gradient-to-bl opacity-50 blur-xl",
                  slide.accentGradient
                )}
              />
              <svg 
                className="absolute right-0 top-0 w-full h-full opacity-20"
                viewBox="0 0 800 400"
                preserveAspectRatio="xMaxYMid slice"
              >
                <path
                  d="M600,0 Q700,100 650,200 T700,400"
                  fill="none"
                  stroke="white"
                  strokeWidth="60"
                  strokeLinecap="round"
                />
                <path
                  d="M700,50 Q800,150 750,250 T800,450"
                  fill="none"
                  stroke="white"
                  strokeWidth="40"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col justify-center px-8 md:px-12 max-w-xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-white/20 backdrop-blur-sm">
                  <Icon className="w-5 h-5 text-white" />
                </div>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                {slide.title}
              </h2>
              <p className="text-white/90 text-sm md:text-base mb-5 leading-relaxed">
                {slide.description}
              </p>
              <div>
                <Button 
                  className="bg-white text-gray-900 hover:bg-white/90 font-semibold shadow-lg"
                  asChild
                >
                  <Link to={slide.href} className="flex items-center gap-2">
                    {slide.cta}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        );
      })}

      {/* Dot Indicators */}
      <div className="absolute bottom-4 right-6 flex gap-2 z-20">
        {bannerSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={cn(
              "w-2.5 h-2.5 rounded-full transition-all duration-300",
              index === currentSlide 
                ? "bg-white scale-110" 
                : "bg-white/40 hover:bg-white/60"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
