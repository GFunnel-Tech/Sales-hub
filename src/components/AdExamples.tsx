import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Facebook, Globe } from "lucide-react";
import vivintAd from "@/assets/vivint-ad.jpg";
import alarmDotComAd from "@/assets/alarm-dot-com-ad.jpg";
import adtAd from "@/assets/adt-ad.jpg";
const adExamples = [{
  platform: "Facebook",
  icon: Facebook,
  type: "Residential Security",
  headline: "Protect Your Home 24/7 with Security Pro",
  body: "Professional home security systems installed in 24 hours. Get a FREE security assessment today!",
  cta: "Get Free Quote",
  targeting: "Homeowners, 35-65, within 30 miles",
  bgColor: "bg-blue-50 dark:bg-blue-950/20",
  accentColor: "text-blue-600 dark:text-blue-400"
}, {
  platform: "Facebook",
  icon: Facebook,
  type: "Commercial Security",
  headline: "Business Security That Never Sleeps",
  body: "Enterprise-grade security systems with 24/7 monitoring. Protect your business assets with cutting-edge technology.",
  cta: "Schedule Consultation",
  targeting: "Business owners, property managers, 30-60",
  bgColor: "bg-blue-50 dark:bg-blue-950/20",
  accentColor: "text-blue-600 dark:text-blue-400"
}, {
  platform: "Google Search",
  icon: Globe,
  type: "High-Intent Search",
  headline: "Security Systems Installation | Security Pro",
  body: "Professional installation in 24hrs. Free quote. A+ rated security company serving residential & commercial clients.",
  cta: "Call Now",
  targeting: "Keywords: 'security system installation', 'home security'",
  bgColor: "bg-green-50 dark:bg-green-950/20",
  accentColor: "text-green-600 dark:text-green-400"
}, {
  platform: "Google Display",
  icon: Globe,
  type: "Retargeting Campaign",
  headline: "Still Thinking About Security? We're Here to Help",
  body: "Limited time: Save 20% on professional security installation. Our experts are standing by.",
  cta: "Claim Offer",
  targeting: "Website visitors, engaged users",
  bgColor: "bg-green-50 dark:bg-green-950/20",
  accentColor: "text-green-600 dark:text-green-400"
}];
export const AdExamples = () => {
  return <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          
          
        </div>

        {/* Competitor Examples Section */}
        <div className="mb-16">
          
          
          
        </div>

        {/* Security Pro Proposed Ads */}
        
        
        <div className="mt-12 text-center">
          
        </div>
      </div>
    </section>;
};