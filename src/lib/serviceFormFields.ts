import { FormField } from "./serviceConfigs";

// Service-specific form fields for each service type
export const serviceFormFields: Record<string, FormField[]> = {
  "paid-ads": [
    {
      name: "adPlatforms",
      label: "Ad Platforms",
      type: "select",
      placeholder: "Select platforms",
      options: [
        { value: "facebook", label: "Facebook/Meta" },
        { value: "google", label: "Google Ads" },
        { value: "both", label: "Both Facebook & Google" },
        { value: "tiktok", label: "TikTok Ads" },
        { value: "linkedin", label: "LinkedIn Ads" },
        { value: "other", label: "Other Platforms" },
      ],
    },
    {
      name: "monthlyAdBudget",
      label: "Monthly Ad Budget",
      type: "select",
      placeholder: "Select budget",
      options: [
        { value: "under-5k", label: "Under $5,000" },
        { value: "5k-10k", label: "$5,000 - $10,000" },
        { value: "10k-25k", label: "$10,000 - $25,000" },
        { value: "25k-50k", label: "$25,000 - $50,000" },
        { value: "50k-plus", label: "$50,000+" },
      ],
    },
    {
      name: "currentROAS",
      label: "Current ROAS (if running ads)",
      type: "text",
      placeholder: "e.g., 2.5x or N/A",
    },
  ],

  "social-media-management": [
    {
      name: "platforms",
      label: "Social Platforms Needed",
      type: "select",
      placeholder: "Select platforms",
      options: [
        { value: "instagram", label: "Instagram" },
        { value: "facebook", label: "Facebook" },
        { value: "linkedin", label: "LinkedIn" },
        { value: "tiktok", label: "TikTok" },
        { value: "twitter", label: "Twitter/X" },
        { value: "multiple", label: "Multiple Platforms" },
      ],
    },
    {
      name: "postingFrequency",
      label: "Desired Posting Frequency",
      type: "select",
      placeholder: "Select frequency",
      options: [
        { value: "daily", label: "Daily" },
        { value: "3-5-week", label: "3-5 times per week" },
        { value: "weekly", label: "Weekly" },
        { value: "custom", label: "Custom Schedule" },
      ],
    },
    {
      name: "currentFollowers",
      label: "Current Total Followers",
      type: "text",
      placeholder: "e.g., 5,000 across all platforms",
    },
  ],

  "funnel-website-design": [
    {
      name: "websiteType",
      label: "Project Type",
      type: "select",
      placeholder: "Select type",
      options: [
        { value: "sales-funnel", label: "Sales Funnel" },
        { value: "lead-gen", label: "Lead Generation Funnel" },
        { value: "full-website", label: "Full Website" },
        { value: "landing-page", label: "Landing Page" },
        { value: "ecommerce", label: "E-commerce Store" },
      ],
    },
    {
      name: "currentWebsite",
      label: "Current Website URL (if any)",
      type: "text",
      placeholder: "https://your-current-site.com",
    },
    {
      name: "pagesNeeded",
      label: "Number of Pages/Steps Needed",
      type: "select",
      placeholder: "Select pages",
      options: [
        { value: "1-3", label: "1-3 pages" },
        { value: "4-7", label: "4-7 pages" },
        { value: "8-15", label: "8-15 pages" },
        { value: "15-plus", label: "15+ pages" },
      ],
    },
  ],

  "copywriting": [
    {
      name: "contentType",
      label: "Content Type Needed",
      type: "select",
      placeholder: "Select content type",
      options: [
        { value: "landing-page", label: "Landing Page Copy" },
        { value: "email-sequence", label: "Email Sequence" },
        { value: "sales-page", label: "Long-form Sales Page" },
        { value: "ad-copy", label: "Ad Copy" },
        { value: "website-copy", label: "Website Copy" },
        { value: "all", label: "Multiple Types" },
      ],
    },
    {
      name: "targetAudience",
      label: "Target Audience",
      type: "text",
      placeholder: "Describe your ideal customer",
    },
    {
      name: "tonePreference",
      label: "Preferred Tone",
      type: "select",
      placeholder: "Select tone",
      options: [
        { value: "professional", label: "Professional & Corporate" },
        { value: "friendly", label: "Friendly & Conversational" },
        { value: "bold", label: "Bold & Direct" },
        { value: "luxury", label: "Premium & Luxury" },
        { value: "casual", label: "Casual & Relatable" },
      ],
    },
  ],

  "video-editing": [
    {
      name: "videoType",
      label: "Video Type",
      type: "select",
      placeholder: "Select video type",
      options: [
        { value: "social-content", label: "Social Media Content" },
        { value: "promotional", label: "Promotional/Ad Video" },
        { value: "testimonial", label: "Testimonial Videos" },
        { value: "educational", label: "Educational/Tutorial" },
        { value: "podcast", label: "Podcast/Interview Clips" },
      ],
    },
    {
      name: "footageProvided",
      label: "Footage Status",
      type: "select",
      placeholder: "Do you have footage?",
      options: [
        { value: "yes-ready", label: "Yes, footage ready" },
        { value: "partial", label: "Some footage available" },
        { value: "need-help", label: "Need help with filming" },
        { value: "stock", label: "Use stock footage" },
      ],
    },
    {
      name: "videoDuration",
      label: "Expected Video Duration",
      type: "select",
      placeholder: "Select duration",
      options: [
        { value: "short", label: "Short form (< 60 sec)" },
        { value: "medium", label: "Medium (1-5 min)" },
        { value: "long", label: "Long form (5-15 min)" },
        { value: "extended", label: "Extended (15+ min)" },
      ],
    },
  ],

  "automation": [
    {
      name: "currentTools",
      label: "Current Tools/Platforms",
      type: "text",
      placeholder: "e.g., HubSpot, Zapier, Salesforce",
    },
    {
      name: "processesToAutomate",
      label: "Processes to Automate",
      type: "select",
      placeholder: "Select process type",
      options: [
        { value: "lead-nurture", label: "Lead Nurturing" },
        { value: "customer-onboard", label: "Customer Onboarding" },
        { value: "follow-ups", label: "Follow-up Sequences" },
        { value: "data-sync", label: "Data Synchronization" },
        { value: "reporting", label: "Reporting & Analytics" },
        { value: "custom", label: "Custom Workflow" },
      ],
    },
    {
      name: "integrations",
      label: "Key Integrations Required",
      type: "textarea",
      placeholder: "List the tools/platforms that need to be connected",
    },
  ],

  "ai-employee": [
    {
      name: "aiUseCase",
      label: "Primary Use Case",
      type: "select",
      placeholder: "Select use case",
      options: [
        { value: "customer-support", label: "Customer Support" },
        { value: "sales-assistant", label: "Sales Assistant" },
        { value: "lead-qualification", label: "Lead Qualification" },
        { value: "appointment-booking", label: "Appointment Booking" },
        { value: "data-entry", label: "Data Entry/Processing" },
        { value: "custom", label: "Custom Use Case" },
      ],
    },
    {
      name: "currentVolume",
      label: "Current Volume (conversations/tasks per day)",
      type: "text",
      placeholder: "e.g., 50 customer inquiries/day",
    },
    {
      name: "responseRequirements",
      label: "Response Time Requirements",
      type: "select",
      placeholder: "Select requirements",
      options: [
        { value: "instant", label: "Instant (< 5 seconds)" },
        { value: "quick", label: "Quick (< 1 minute)" },
        { value: "standard", label: "Standard (< 5 minutes)" },
        { value: "flexible", label: "Flexible" },
      ],
    },
  ],

  "administrative-services": [
    {
      name: "tasksNeeded",
      label: "Tasks Needed",
      type: "select",
      placeholder: "Select task type",
      options: [
        { value: "scheduling", label: "Scheduling & Calendar" },
        { value: "data-entry", label: "Data Entry" },
        { value: "research", label: "Research" },
        { value: "documentation", label: "Documentation" },
        { value: "customer-service", label: "Customer Service" },
        { value: "multiple", label: "Multiple Tasks" },
      ],
    },
    {
      name: "hoursNeeded",
      label: "Hours Per Week",
      type: "select",
      placeholder: "Select hours",
      options: [
        { value: "5-10", label: "5-10 hours" },
        { value: "10-20", label: "10-20 hours" },
        { value: "20-40", label: "20-40 hours" },
        { value: "full-time", label: "Full-time (40+)" },
      ],
    },
  ],

  "vsl-creation": [
    {
      name: "vslPurpose",
      label: "VSL Purpose",
      type: "select",
      placeholder: "Select purpose",
      options: [
        { value: "product-launch", label: "Product Launch" },
        { value: "evergreen-sales", label: "Evergreen Sales" },
        { value: "webinar-replacement", label: "Webinar Replacement" },
        { value: "lead-gen", label: "Lead Generation" },
      ],
    },
    {
      name: "scriptStatus",
      label: "Script Status",
      type: "select",
      placeholder: "Do you have a script?",
      options: [
        { value: "have-script", label: "Script ready" },
        { value: "need-script", label: "Need script written" },
        { value: "draft", label: "Have draft, need polish" },
      ],
    },
    {
      name: "targetLength",
      label: "Target Video Length",
      type: "select",
      placeholder: "Select length",
      options: [
        { value: "short", label: "Short (5-10 min)" },
        { value: "medium", label: "Medium (10-20 min)" },
        { value: "long", label: "Long (20-45 min)" },
        { value: "extended", label: "Extended (45+ min)" },
      ],
    },
  ],

  "graphic-design": [
    {
      name: "designType",
      label: "Design Type Needed",
      type: "select",
      placeholder: "Select design type",
      options: [
        { value: "logo", label: "Logo Design" },
        { value: "social-graphics", label: "Social Media Graphics" },
        { value: "ad-creatives", label: "Ad Creatives" },
        { value: "print", label: "Print Materials" },
        { value: "brand-package", label: "Full Brand Package" },
        { value: "other", label: "Other" },
      ],
    },
    {
      name: "brandGuidelines",
      label: "Brand Guidelines Status",
      type: "select",
      placeholder: "Do you have brand guidelines?",
      options: [
        { value: "yes", label: "Yes, complete guidelines" },
        { value: "partial", label: "Some brand assets" },
        { value: "none", label: "No, need to create" },
      ],
    },
  ],

  "prospect-outreach": [
    {
      name: "outreachChannels",
      label: "Preferred Outreach Channels",
      type: "select",
      placeholder: "Select channels",
      options: [
        { value: "email", label: "Email Only" },
        { value: "linkedin", label: "LinkedIn Only" },
        { value: "email-linkedin", label: "Email + LinkedIn" },
        { value: "multi-channel", label: "Multi-channel" },
      ],
    },
    {
      name: "targetIndustry",
      label: "Target Industry",
      type: "text",
      placeholder: "e.g., SaaS, Real Estate, Healthcare",
    },
    {
      name: "monthlyLeadGoal",
      label: "Monthly Lead Goal",
      type: "select",
      placeholder: "Select goal",
      options: [
        { value: "50-100", label: "50-100 leads" },
        { value: "100-250", label: "100-250 leads" },
        { value: "250-500", label: "250-500 leads" },
        { value: "500-plus", label: "500+ leads" },
      ],
    },
  ],

  "slide-decks": [
    {
      name: "deckPurpose",
      label: "Deck Purpose",
      type: "select",
      placeholder: "Select purpose",
      options: [
        { value: "sales", label: "Sales Presentation" },
        { value: "investor", label: "Investor Pitch" },
        { value: "training", label: "Training/Education" },
        { value: "conference", label: "Conference/Speaking" },
        { value: "internal", label: "Internal Presentation" },
      ],
    },
    {
      name: "slideCount",
      label: "Approximate Slide Count",
      type: "select",
      placeholder: "Select slide count",
      options: [
        { value: "5-10", label: "5-10 slides" },
        { value: "10-20", label: "10-20 slides" },
        { value: "20-40", label: "20-40 slides" },
        { value: "40-plus", label: "40+ slides" },
      ],
    },
  ],

  "integration-services": [
    {
      name: "primaryPlatform",
      label: "Primary Platform",
      type: "text",
      placeholder: "e.g., Salesforce, HubSpot",
    },
    {
      name: "integrationType",
      label: "Integration Type",
      type: "select",
      placeholder: "Select type",
      options: [
        { value: "crm-marketing", label: "CRM + Marketing" },
        { value: "payment", label: "Payment Systems" },
        { value: "ecommerce", label: "E-commerce" },
        { value: "custom-api", label: "Custom API" },
        { value: "multiple", label: "Multiple Integrations" },
      ],
    },
    {
      name: "dataFlow",
      label: "Data Flow Requirements",
      type: "textarea",
      placeholder: "Describe what data needs to flow between systems",
    },
  ],

  "migration-services": [
    {
      name: "migrationFrom",
      label: "Migrating From",
      type: "text",
      placeholder: "Current platform/system",
    },
    {
      name: "migrationTo",
      label: "Migrating To",
      type: "text",
      placeholder: "Target platform/system",
    },
    {
      name: "dataVolume",
      label: "Data Volume",
      type: "select",
      placeholder: "Select volume",
      options: [
        { value: "small", label: "Small (< 10k records)" },
        { value: "medium", label: "Medium (10k-100k records)" },
        { value: "large", label: "Large (100k-1M records)" },
        { value: "enterprise", label: "Enterprise (1M+ records)" },
      ],
    },
  ],
};

export const getFormFieldsForService = (slug: string): FormField[] => {
  return serviceFormFields[slug] || [];
};
