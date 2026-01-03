import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar } from "lucide-react";

export const HomeCTA = () => {
  return (
    <section className="py-16 px-4 relative overflow-hidden bg-gradient-to-br from-primary to-secondary">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTAtNHYyaDJ2LTJoLTJ6bTItMTZ2Mmgydi0yaC0yem0wIDR2Mmgydi0yaC0yem0wIDR2Mmgydi0yaC0yem0wIDR2Mmgydi0yaC0yem0wIDR2Mmgydi0yaC0yem0tNCAwdjJoMnYtMmgtMnptLTQgMHYyaDJ2LTJoLTJ6bS00IDB2Mmgydi0yaC0yem0tNCAwdjJoMnYtMmgtMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>
      
      <div className="container mx-auto max-w-3xl relative z-10">
        <div className="text-center space-y-5">
          <h2 className="text-2xl md:text-4xl font-bold text-primary-foreground tracking-tight">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="text-base md:text-lg text-primary-foreground/90 max-w-xl mx-auto">
            Join thousands of entrepreneurs and business owners who are building their skills and growing their businesses through our programs.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-2">
            <Button 
              variant="gradient" 
              size="lg"
              asChild
            >
              <a href="https://www.gfunnel.com/create-account" target="_parent" rel="noopener noreferrer">
                Browse Programs
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
            
            <Button 
              variant="gradient-secondary"
              size="lg"
              asChild
            >
              <a href="https://www.gfunnel.com/discover" target="_parent" rel="noopener noreferrer">
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Consultation
              </a>
            </Button>
          </div>

          <p className="text-xs text-primary-foreground/60 pt-2">
            Free consultation available • Self-paced learning • Expert instructors
          </p>
        </div>
      </div>
    </section>
  );
};
