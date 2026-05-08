import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Rocket,
  Calendar,
  GraduationCap,
  Sparkles,
  PhoneCall,
  Target,
  MessageCircle,
  Trophy,
  Briefcase,
  DollarSign,
  BarChart3,
  UserPlus,
  LayoutGrid,
  Lightbulb,
  Heart,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useBannerSlides, type BannerPlacement } from "@/hooks/useBannerSlides";

const ICON_MAP: Record<string, LucideIcon> = {
  Rocket, Calendar, GraduationCap, Sparkles, PhoneCall, Target,
  MessageCircle, Trophy, Briefcase, DollarSign, BarChart3, UserPlus,
  LayoutGrid, Lightbulb, Heart, Zap,
};

interface RoleAwareBannerProps {
  placement?: BannerPlacement;
}

export function RoleAwareBanner({ placement = "home" }: RoleAwareBannerProps) {
  const { slides, loading } = useBannerSlides(placement);
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (slides.length === 0 ? 0 : (prev + 1) % slides.length));
  }, [slides.length]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide, slides.length]);

  useEffect(() => {
    setCurrentSlide(0);
  }, [slides.length]);

  if (loading || slides.length === 0) {
    return (
      <div className="relative w-full h-[280px] md:h-[320px] rounded-2xl overflow-hidden bg-muted animate-pulse" />
    );
  }

  return (
    <div className="relative w-full h-[280px] md:h-[320px] rounded-2xl overflow-hidden shadow-xl">
      {slides.map((slide, index) => {
        const Icon = ICON_MAP[slide.icon] ?? Sparkles;
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
            <div className={cn("absolute inset-0 bg-gradient-to-br", slide.gradient)} />
            <div className="absolute inset-0 overflow-hidden">
              <div className={cn("absolute -right-20 -top-20 w-[600px] h-[600px] rounded-full bg-gradient-to-br opacity-40 blur-3xl", slide.accent_gradient)} />
              <div className={cn("absolute right-1/4 top-1/2 w-[300px] h-[300px] rounded-full bg-gradient-to-tr opacity-30 blur-2xl", slide.accent_gradient)} />
              <div className={cn("absolute right-10 bottom-10 w-[150px] h-[150px] rounded-full bg-gradient-to-bl opacity-50 blur-xl", slide.accent_gradient)} />
              <svg className="absolute right-0 top-0 w-full h-full opacity-20" viewBox="0 0 800 400" preserveAspectRatio="xMaxYMid slice">
                <path d="M600,0 Q700,100 650,200 T700,400" fill="none" stroke="white" strokeWidth="60" strokeLinecap="round" />
                <path d="M700,50 Q800,150 750,250 T800,450" fill="none" stroke="white" strokeWidth="40" strokeLinecap="round" />
              </svg>
            </div>

            <div className="relative z-10 h-full flex flex-col justify-center px-8 md:px-12 max-w-xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-white/20 backdrop-blur-sm">
                  <Icon className="w-5 h-5 text-white" />
                </div>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{slide.title}</h2>
              <p className="text-white/90 text-sm md:text-base mb-5 leading-relaxed">{slide.description}</p>
              <div>
                <Button className="bg-white text-gray-900 hover:bg-white/90 font-semibold shadow-lg" asChild>
                  <Link to={slide.cta_href} className="flex items-center gap-2">
                    {slide.cta_label}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        );
      })}

      {slides.length > 1 && (
        <div className="absolute bottom-4 right-6 flex gap-2 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={cn(
                "w-2.5 h-2.5 rounded-full transition-all duration-300",
                index === currentSlide ? "bg-white scale-110" : "bg-white/40 hover:bg-white/60"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
