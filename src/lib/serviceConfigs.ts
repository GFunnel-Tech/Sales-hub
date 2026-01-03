import { LucideIcon, BookOpen, Users, Calendar, Video, Presentation, GraduationCap, Mic, Globe, Award, Lightbulb, Target, TrendingUp, FileText, Briefcase, Building2 } from "lucide-react";

export interface ServiceStat {
  value: string;
  label: string;
}

export interface ServiceFeature {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface ServiceVideo {
  id: string;
  title: string;
  thumbnail: string;
  embedUrl: string;
}

export interface QuickActionContent {
  statValue: string;
  statLabel: string;
  description: string;
}

export interface FormField {
  name: string;
  label: string;
  type: "text" | "select" | "textarea";
  placeholder?: string;
  options?: { value: string; label: string }[];
  required?: boolean;
}

export interface ServiceConfig {
  slug: string;
  name: string;
  title: string;
  badgeText: string;
  badgeIcon: LucideIcon;
  description: string;
  stats: ServiceStat[];
  features: ServiceFeature[];
  videos: ServiceVideo[];
  onboardingUrl: string;
  discoveryUrl: string;
  relatedServices: string[];
  quickActionContent?: QuickActionContent;
  formFields?: FormField[];
}

// Default videos - can be customized per program
const defaultVideos: ServiceVideo[] = [
  {
    id: "video1",
    title: "Program Overview",
    thumbnail: "https://img.youtube.com/vi/0nI1JjB43BI/maxresdefault.jpg",
    embedUrl: "https://www.youtube.com/embed/0nI1JjB43BI"
  },
  {
    id: "video2",
    title: "What You'll Learn",
    thumbnail: "https://img.youtube.com/vi/iVoFm1886Go/maxresdefault.jpg",
    embedUrl: "https://www.youtube.com/embed/iVoFm1886Go"
  },
  {
    id: "video3",
    title: "Success Stories",
    thumbnail: "https://img.youtube.com/vi/y4fFta7C7Uc/maxresdefault.jpg",
    embedUrl: "https://www.youtube.com/embed/y4fFta7C7Uc"
  }
];

export const serviceConfigs: Record<string, ServiceConfig> = {
  "courses": {
    slug: "courses",
    name: "Online Courses",
    title: "Self-Paced Online Courses",
    badgeText: "Learn Anytime",
    badgeIcon: BookOpen,
    description: "Comprehensive self-paced courses covering business fundamentals, marketing, operations, and growth strategies",
    stats: [
      { value: "50+", label: "Courses" },
      { value: "Self-Paced", label: "Format" },
      { value: "Certificate", label: "Included" }
    ],
    features: [
      { icon: BookOpen, title: "Structured Curriculum", description: "Step-by-step learning paths" },
      { icon: Video, title: "Video Lessons", description: "HD quality instruction" },
      { icon: Award, title: "Certifications", description: "Earn credentials" }
    ],
    videos: defaultVideos,
    onboardingUrl: "https://www.gfunnel.com/courses",
    discoveryUrl: "https://www.gfunnel.com/discover?program=courses",
    relatedServices: ["masterclasses", "workshops", "live-trainings"],
    quickActionContent: {
      statValue: "50+",
      statLabel: "Courses Available",
      description: "Start learning at your own pace today"
    }
  },
  
  "workshops": {
    slug: "workshops",
    name: "Interactive Workshops",
    title: "Hands-On Workshops",
    badgeText: "Interactive",
    badgeIcon: Users,
    description: "Interactive, hands-on workshops where you'll build real business assets and get direct feedback from experts",
    stats: [
      { value: "2-4 hrs", label: "Duration" },
      { value: "Live", label: "Interaction" },
      { value: "Weekly", label: "Sessions" }
    ],
    features: [
      { icon: Users, title: "Small Groups", description: "Personalized attention" },
      { icon: Lightbulb, title: "Hands-On", description: "Build as you learn" },
      { icon: Target, title: "Action-Focused", description: "Leave with results" }
    ],
    videos: defaultVideos,
    onboardingUrl: "https://www.gfunnel.com/workshops",
    discoveryUrl: "https://www.gfunnel.com/discover?program=workshops",
    relatedServices: ["courses", "live-trainings", "events"],
    quickActionContent: {
      statValue: "Weekly",
      statLabel: "New Workshops",
      description: "Get hands-on experience with expert guidance"
    }
  },

  "events": {
    slug: "events",
    name: "Business Events",
    title: "In-Person & Hybrid Events",
    badgeText: "Networking",
    badgeIcon: Calendar,
    description: "Connect with fellow entrepreneurs at our in-person and hybrid events featuring keynote speakers and networking opportunities",
    stats: [
      { value: "Monthly", label: "Events" },
      { value: "500+", label: "Attendees" },
      { value: "Global", label: "Locations" }
    ],
    features: [
      { icon: Calendar, title: "Regular Events", description: "Monthly opportunities" },
      { icon: Users, title: "Networking", description: "Build your network" },
      { icon: Mic, title: "Expert Speakers", description: "Industry leaders" }
    ],
    videos: defaultVideos,
    onboardingUrl: "https://www.gfunnel.com/events",
    discoveryUrl: "https://www.gfunnel.com/discover?program=events",
    relatedServices: ["virtual-summits", "workshops", "masterclasses"],
    quickActionContent: {
      statValue: "Monthly",
      statLabel: "Events",
      description: "Join our next business event"
    }
  },

  "virtual-summits": {
    slug: "virtual-summits",
    name: "Virtual Summits",
    title: "Online Virtual Summits",
    badgeText: "Multi-Speaker",
    badgeIcon: Globe,
    description: "Multi-day virtual summits featuring industry experts, panel discussions, and actionable business strategies",
    stats: [
      { value: "20+", label: "Speakers" },
      { value: "3 Days", label: "Duration" },
      { value: "Quarterly", label: "Schedule" }
    ],
    features: [
      { icon: Globe, title: "Access Anywhere", description: "Join from any location" },
      { icon: Presentation, title: "Expert Panels", description: "Industry discussions" },
      { icon: Video, title: "Recordings", description: "Lifetime access" }
    ],
    videos: defaultVideos,
    onboardingUrl: "https://www.gfunnel.com/summits",
    discoveryUrl: "https://www.gfunnel.com/discover?program=virtual-summits",
    relatedServices: ["events", "masterclasses", "live-trainings"],
    quickActionContent: {
      statValue: "20+",
      statLabel: "Expert Speakers",
      description: "Learn from the best in the industry"
    }
  },

  "live-trainings": {
    slug: "live-trainings",
    name: "Live Trainings",
    title: "Live Training Sessions",
    badgeText: "Real-Time",
    badgeIcon: Video,
    description: "Real-time training sessions with live Q&A, screen sharing, and direct interaction with instructors",
    stats: [
      { value: "Live", label: "Sessions" },
      { value: "Q&A", label: "Included" },
      { value: "Replays", label: "Available" }
    ],
    features: [
      { icon: Video, title: "Live Streaming", description: "Real-time instruction" },
      { icon: Users, title: "Live Q&A", description: "Ask questions directly" },
      { icon: BookOpen, title: "Workbooks", description: "Follow along materials" }
    ],
    videos: defaultVideos,
    onboardingUrl: "https://www.gfunnel.com/live-trainings",
    discoveryUrl: "https://www.gfunnel.com/discover?program=live-trainings",
    relatedServices: ["workshops", "courses", "masterclasses"],
    quickActionContent: {
      statValue: "Live",
      statLabel: "Instruction",
      description: "Get real-time answers to your questions"
    }
  },

  "masterclasses": {
    slug: "masterclasses",
    name: "Masterclasses",
    title: "Expert Masterclasses",
    badgeText: "Advanced",
    badgeIcon: GraduationCap,
    description: "Deep-dive masterclasses taught by industry leaders covering advanced business strategies and specialized skills",
    stats: [
      { value: "Expert", label: "Instructors" },
      { value: "4-8 hrs", label: "Duration" },
      { value: "Advanced", label: "Level" }
    ],
    features: [
      { icon: GraduationCap, title: "Expert-Led", description: "Industry leaders teach" },
      { icon: Target, title: "Specialized", description: "Deep topic focus" },
      { icon: Award, title: "Premium", description: "Exclusive content" }
    ],
    videos: defaultVideos,
    onboardingUrl: "https://www.gfunnel.com/masterclasses",
    discoveryUrl: "https://www.gfunnel.com/discover?program=masterclasses",
    relatedServices: ["courses", "live-trainings", "virtual-summits"],
    quickActionContent: {
      statValue: "Expert",
      statLabel: "Instruction",
      description: "Learn advanced strategies from the best"
    }
  },

  "business-startup": {
    slug: "business-startup",
    name: "Business Startup",
    title: "Business Startup Workshop",
    badgeText: "Foundation",
    badgeIcon: Briefcase,
    description: "Everything you need to start your business the right way - from idea validation to launch strategy",
    stats: [
      { value: "8 Weeks", label: "Program" },
      { value: "Step-by-Step", label: "Guidance" },
      { value: "1-on-1", label: "Support" }
    ],
    features: [
      { icon: Lightbulb, title: "Idea Validation", description: "Test your concept" },
      { icon: FileText, title: "Business Planning", description: "Create your roadmap" },
      { icon: Target, title: "Launch Strategy", description: "Go to market plan" }
    ],
    videos: defaultVideos,
    onboardingUrl: "https://www.gfunnel.com/business-startup",
    discoveryUrl: "https://www.gfunnel.com/discover?program=business-startup",
    relatedServices: ["business-registration", "courses", "workshops"],
    quickActionContent: {
      statValue: "8 Weeks",
      statLabel: "to Launch",
      description: "Start your business journey with expert guidance"
    }
  },

  "business-registration": {
    slug: "business-registration",
    name: "Business Registration",
    title: "Business Registration Workshop",
    badgeText: "Legal Setup",
    badgeIcon: Building2,
    description: "Navigate the legal requirements of starting a business - LLC formation, EIN, licensing, and compliance",
    stats: [
      { value: "4 Hours", label: "Workshop" },
      { value: "Templates", label: "Included" },
      { value: "Checklists", label: "Provided" }
    ],
    features: [
      { icon: FileText, title: "LLC Formation", description: "Step-by-step process" },
      { icon: Building2, title: "Business Structure", description: "Choose the right type" },
      { icon: Award, title: "Compliance", description: "Stay legally protected" }
    ],
    videos: defaultVideos,
    onboardingUrl: "https://www.gfunnel.com/business-registration",
    discoveryUrl: "https://www.gfunnel.com/discover?program=business-registration",
    relatedServices: ["business-startup", "workshops", "courses"],
    quickActionContent: {
      statValue: "Same Day",
      statLabel: "Registration",
      description: "Get your business legally set up today"
    }
  },

  "marketing-fundamentals": {
    slug: "marketing-fundamentals",
    name: "Marketing Fundamentals",
    title: "Marketing Fundamentals Course",
    badgeText: "Essential",
    badgeIcon: TrendingUp,
    description: "Master the core principles of marketing - branding, positioning, customer acquisition, and growth strategies",
    stats: [
      { value: "12 Modules", label: "Lessons" },
      { value: "Self-Paced", label: "Learning" },
      { value: "Certificate", label: "Included" }
    ],
    features: [
      { icon: Target, title: "Brand Strategy", description: "Build your brand" },
      { icon: Users, title: "Customer Acquisition", description: "Attract customers" },
      { icon: TrendingUp, title: "Growth Tactics", description: "Scale your business" }
    ],
    videos: defaultVideos,
    onboardingUrl: "https://www.gfunnel.com/marketing-fundamentals",
    discoveryUrl: "https://www.gfunnel.com/discover?program=marketing-fundamentals",
    relatedServices: ["courses", "workshops", "masterclasses"],
    quickActionContent: {
      statValue: "12",
      statLabel: "Modules",
      description: "Learn marketing from the ground up"
    }
  },

  "financial-literacy": {
    slug: "financial-literacy",
    name: "Financial Literacy",
    title: "Business Financial Literacy",
    badgeText: "Money Mastery",
    badgeIcon: Award,
    description: "Understand business finances - budgeting, cash flow, profit margins, and financial planning for entrepreneurs",
    stats: [
      { value: "6 Weeks", label: "Course" },
      { value: "Templates", label: "Included" },
      { value: "Spreadsheets", label: "Provided" }
    ],
    features: [
      { icon: FileText, title: "Budgeting", description: "Plan your finances" },
      { icon: TrendingUp, title: "Cash Flow", description: "Manage money flow" },
      { icon: Target, title: "Profit Planning", description: "Maximize earnings" }
    ],
    videos: defaultVideos,
    onboardingUrl: "https://www.gfunnel.com/financial-literacy",
    discoveryUrl: "https://www.gfunnel.com/discover?program=financial-literacy",
    relatedServices: ["business-startup", "courses", "workshops"],
    quickActionContent: {
      statValue: "6 Weeks",
      statLabel: "to Mastery",
      description: "Take control of your business finances"
    }
  }
};

export const getServiceBySlug = (slug: string): ServiceConfig | undefined => {
  return serviceConfigs[slug];
};

export const getAllServices = (): ServiceConfig[] => {
  return Object.values(serviceConfigs);
};

export const getRelatedServices = (currentSlug: string): ServiceConfig[] => {
  const currentService = serviceConfigs[currentSlug];
  if (!currentService) return [];
  
  return currentService.relatedServices
    .map(slug => serviceConfigs[slug])
    .filter((service): service is ServiceConfig => service !== undefined);
};
