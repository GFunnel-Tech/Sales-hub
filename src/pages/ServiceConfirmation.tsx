import { useLocation, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2, Calendar } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const ServiceConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const serviceName = location.state?.serviceName || "Your Service";
  const serviceSlug = location.state?.serviceSlug || "";

  return (
    <div className="min-h-screen bg-background">
      {/* Top Right Schedule Discovery Button */}
      <div className="absolute top-4 right-4 z-10">
        <Button 
          variant="gradient" 
          size="sm" 
          className="gap-2"
          onClick={() => window.open("https://www.gfunnel.com/discover", "_blank")}
        >
          <Calendar className="w-4 h-4" />
          Schedule Discovery
        </Button>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/service-hub">Service Hub</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to={serviceSlug ? `/${serviceSlug}` : "/services"}>
                  {serviceName}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Confirmation</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="text-center mb-8">
          <p className="text-sm font-medium text-primary mb-2">Request Submitted</p>
          <h1 className="text-3xl font-bold text-foreground mb-3">We're On It!</h1>
          <p className="text-muted-foreground">
            Your request has been received and our team is already reviewing it.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-4 mb-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center">
              <CheckCircle className="w-5 h-5" />
            </div>
            <span className="text-sm text-muted-foreground">Request Details</span>
          </div>
          <div className="w-12 h-px bg-primary" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
              2
            </div>
            <span className="text-sm font-medium text-foreground">Access Projects</span>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Your Project Is Being Set Up!</h2>
          <p className="text-muted-foreground mb-6">
            We're organizing your {serviceName} request into actionable tasks.
          </p>

          <div className="bg-muted/50 rounded-lg p-4 mb-8">
            <p className="text-sm text-muted-foreground mb-1">Service Requested:</p>
            <p className="font-medium text-foreground">{serviceName}</p>
          </div>

          <p className="text-sm font-medium text-foreground mb-4">Watch how your project is being organized</p>

          {/* Video Player */}
          <div 
            className="relative mb-8 rounded-lg overflow-hidden" 
            style={{ paddingTop: "56.25%" }}
          >
            <div className="absolute inset-0">
              <iframe
                src="https://videosuite-player.vercel.app/?hash=69408612ef0b6&apiUrl=https://videosuite.app&analyticsUrl=https://api.vidanalytics.io&appEnv=live"
                width="100%"
                height="100%"
                frameBorder="0"
                allow="autoplay; fullscreen"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
          </div>

          <div className="text-left bg-muted/30 rounded-lg p-4 mb-8">
            <p className="text-sm font-medium text-foreground mb-3">What happens next:</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                Our team reviews your request within 24 hours
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                We'll create a detailed project plan with deliverables
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                You'll receive access to track progress in real-time
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                A specialist will reach out to discuss next steps
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <Button 
              variant="gradient"
              size="lg"
              className="w-full"
              onClick={() => window.open("https://gitscrum.com/workspace", "_parent")}
            >
              Access Projects
            </Button>
            
            <p className="text-sm text-muted-foreground">or</p>
            
            <Button 
              variant="gradient-secondary"
              size="lg" 
              className="w-full"
              onClick={() => window.open("https://www.gfunnel.com/software-plans", "_parent")}
            >
              See Current Service Plans
            </Button>

            <Button
              variant="ghost"
              className="text-sm text-muted-foreground hover:text-foreground"
              onClick={() => navigate(serviceSlug ? `/${serviceSlug}` : "/services")}
            >
              ← Submit another request
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceConfirmation;
