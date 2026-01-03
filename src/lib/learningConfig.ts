// Learning Hub Data Structure - Topic-based learning with modules, instructors, and resources

export interface LearningModule {
  id: string;
  title: string;
  description: string;
  format: 'course' | 'workshop' | 'live-training' | 'event' | 'masterclass' | 'resource';
  duration: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  url: string; // Direct link to the module
  thumbnail?: string;
  outcomes: string[];
}

export interface Instructor {
  name: string;
  title: string;
  avatar: string;
  bio: string;
  expertise: string[];
}

export interface UpcomingSession {
  title: string;
  duration: string; // e.g., "45 min", "1 hour"
  format: 'workshop' | 'live-training' | 'event' | 'summit' | 'webinar';
  registrationUrl: string;
}

export interface StudentResource {
  title: string;
  type: 'template' | 'workbook' | 'checklist' | 'guide' | 'community';
  url: string;
  icon: string;
}

export interface LearningTopic {
  slug: string;
  externalSlug: string; // Maps to gfunnel.com URL path
  videoHash: string; // VideoSuite embed hash
  name: string;
  icon: string;
  tagline: string;
  description: string;
  color: string;
  modules: LearningModule[];
  instructors: Instructor[];
  upcomingSessions: UpcomingSession[];
  resources: StudentResource[];
}

export const learningTopics: LearningTopic[] = [
  {
    slug: 'starting-a-business',
    externalSlug: 'from-idea-to-launch',
    videoHash: '694e165269a23',
    name: 'Starting a Business',
    icon: '🚀',
    tagline: 'From idea to launch',
    description: 'Everything you need to validate your idea, create a business plan, and launch your first venture successfully.',
    color: 'blue',
    modules: [
      {
        id: 'idea-validation',
        title: 'Business Idea Validation',
        description: 'Learn how to test your business idea before investing time and money. Covers market research, customer interviews, and MVP testing.',
        format: 'course',
        duration: '2 hours',
        level: 'beginner',
        url: 'https://learn.gfunnel.com/courses/idea-validation',
        outcomes: ['Validate your idea with real customers', 'Identify your target market', 'Create a minimum viable product plan']
      },
      {
        id: 'business-model-canvas',
        title: 'Business Model Canvas Workshop',
        description: 'Interactive workshop to map out your entire business model on one page. Leave with a complete canvas.',
        format: 'workshop',
        duration: '3 hours',
        level: 'beginner',
        url: 'https://learn.gfunnel.com/workshops/business-model-canvas',
        outcomes: ['Complete business model canvas', 'Identify revenue streams', 'Map customer segments']
      },
      {
        id: 'first-customers',
        title: 'Getting Your First 10 Customers',
        description: 'Practical strategies to acquire your first paying customers without a big marketing budget.',
        format: 'live-training',
        duration: '90 minutes',
        level: 'beginner',
        url: 'https://learn.gfunnel.com/live/first-customers',
        outcomes: ['Customer acquisition strategies', 'Pre-launch list building', 'Early traction tactics']
      },
      {
        id: 'startup-funding',
        title: 'Funding Your Startup',
        description: 'Explore bootstrapping, loans, grants, and investor funding options for new businesses.',
        format: 'masterclass',
        duration: '4 hours',
        level: 'intermediate',
        url: 'https://learn.gfunnel.com/masterclass/startup-funding',
        outcomes: ['Understand funding options', 'Prepare investor pitch', 'Bootstrap effectively']
      },
      {
        id: 'launch-strategy',
        title: 'Launch Strategy Blueprint',
        description: 'Step-by-step guide to planning and executing a successful business launch.',
        format: 'course',
        duration: '3 hours',
        level: 'beginner',
        url: 'https://learn.gfunnel.com/courses/launch-strategy',
        outcomes: ['Create launch timeline', 'Build pre-launch buzz', 'Execute launch day plan']
      }
    ],
    instructors: [
      {
        name: 'Sarah Chen',
        title: 'Startup Strategist',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
        bio: 'Founded 3 successful startups. Helped 500+ entrepreneurs launch their businesses.',
        expertise: ['Idea Validation', 'Business Planning', 'Go-to-Market Strategy']
      },
      {
        name: 'Marcus Johnson',
        title: 'Business Coach',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
        bio: '15 years helping first-time entrepreneurs build sustainable businesses.',
        expertise: ['Business Fundamentals', 'Customer Development', 'Lean Startup']
      }
    ],
    upcomingSessions: [
      {
        title: 'Business Model Canvas Workshop',
        duration: '90 min',
        format: 'webinar',
        registrationUrl: 'https://learn.gfunnel.com/register/bmc-jan'
      },
      {
        title: 'Q&A: Starting Your First Business',
        duration: '60 min',
        format: 'webinar',
        registrationUrl: 'https://learn.gfunnel.com/register/qa-startup'
      }
    ],
    resources: [
      { title: 'Business Plan Template', type: 'template', url: '#', icon: '📝' },
      { title: 'Startup Checklist', type: 'checklist', url: '#', icon: '✅' },
      { title: 'Founder Community', type: 'community', url: '#', icon: '👥' },
      { title: 'Pitch Deck Template', type: 'template', url: '#', icon: '🎯' }
    ]
  },
  {
    slug: 'legal-registration',
    externalSlug: 'set-up-your-business-correctly',
    videoHash: '694e16b903e45',
    name: 'Legal & Registration',
    icon: '📋',
    tagline: 'Set up your business correctly',
    description: 'Navigate LLC formation, business registration, licensing, and legal compliance to protect your business.',
    color: 'purple',
    modules: [
      {
        id: 'llc-formation',
        title: 'LLC Formation Step-by-Step',
        description: 'Complete guide to forming your LLC including state requirements, operating agreements, and EIN registration.',
        format: 'course',
        duration: '2.5 hours',
        level: 'beginner',
        url: 'https://learn.gfunnel.com/courses/llc-formation',
        outcomes: ['Register your LLC', 'Draft operating agreement', 'Obtain EIN from IRS']
      },
      {
        id: 'business-structure',
        title: 'Choosing Your Business Structure',
        description: 'Compare LLC, S-Corp, C-Corp, and Sole Proprietorship to pick the right structure for your situation.',
        format: 'workshop',
        duration: '2 hours',
        level: 'beginner',
        url: 'https://learn.gfunnel.com/workshops/business-structure',
        outcomes: ['Understand entity types', 'Tax implications', 'Liability protection']
      },
      {
        id: 'business-licensing',
        title: 'Business Licensing & Permits',
        description: 'Navigate federal, state, and local licensing requirements for your specific industry.',
        format: 'course',
        duration: '1.5 hours',
        level: 'beginner',
        url: 'https://learn.gfunnel.com/courses/licensing',
        outcomes: ['Identify required licenses', 'Application process', 'Renewal requirements']
      },
      {
        id: 'contracts-101',
        title: 'Contracts for Entrepreneurs',
        description: 'Essential contract knowledge including client agreements, NDAs, and vendor contracts.',
        format: 'masterclass',
        duration: '3 hours',
        level: 'intermediate',
        url: 'https://learn.gfunnel.com/masterclass/contracts',
        outcomes: ['Draft basic contracts', 'Protect your interests', 'Avoid common legal mistakes']
      },
      {
        id: 'trademark-basics',
        title: 'Trademark Your Brand',
        description: 'Protect your business name, logo, and brand with proper trademark registration.',
        format: 'live-training',
        duration: '90 minutes',
        level: 'beginner',
        url: 'https://learn.gfunnel.com/live/trademark',
        outcomes: ['Trademark search', 'Filing process', 'Brand protection strategy']
      }
    ],
    instructors: [
      {
        name: 'David Park',
        title: 'Business Attorney',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
        bio: 'Business attorney specializing in startups and small business formation for 12 years.',
        expertise: ['LLC Formation', 'Contracts', 'Intellectual Property']
      }
    ],
    upcomingSessions: [
      {
        title: 'LLC Formation Live Workshop',
        duration: '75 min',
        format: 'webinar',
        registrationUrl: 'https://learn.gfunnel.com/register/llc-workshop'
      }
    ],
    resources: [
      { title: 'LLC Operating Agreement Template', type: 'template', url: '#', icon: '📄' },
      { title: 'Business Registration Checklist', type: 'checklist', url: '#', icon: '✅' },
      { title: 'State Requirements Guide', type: 'guide', url: '#', icon: '📖' },
      { title: 'Contract Templates Bundle', type: 'template', url: '#', icon: '📝' }
    ]
  },
  {
    slug: 'marketing-sales',
    externalSlug: 'attract-and-convert-customers',
    videoHash: '694e1708255e4',
    name: 'Marketing & Sales',
    icon: '📈',
    tagline: 'Attract and convert customers',
    description: 'Master digital marketing, sales strategies, and customer acquisition to grow your revenue consistently.',
    color: 'green',
    modules: [
      {
        id: 'marketing-fundamentals',
        title: 'Marketing Fundamentals',
        description: 'Core marketing principles including positioning, messaging, and customer psychology.',
        format: 'course',
        duration: '4 hours',
        level: 'beginner',
        url: 'https://learn.gfunnel.com/courses/marketing-fundamentals',
        outcomes: ['Create marketing strategy', 'Define brand positioning', 'Craft compelling messaging']
      },
      {
        id: 'social-media-mastery',
        title: 'Social Media Marketing Mastery',
        description: 'Build your brand and generate leads on Instagram, LinkedIn, Facebook, and TikTok.',
        format: 'course',
        duration: '5 hours',
        level: 'beginner',
        url: 'https://learn.gfunnel.com/courses/social-media',
        outcomes: ['Content strategy', 'Platform-specific tactics', 'Engagement growth']
      },
      {
        id: 'sales-conversations',
        title: 'Sales Conversations That Convert',
        description: 'Master consultative selling, objection handling, and closing techniques.',
        format: 'masterclass',
        duration: '4 hours',
        level: 'intermediate',
        url: 'https://learn.gfunnel.com/masterclass/sales-conversations',
        outcomes: ['Discovery questioning', 'Handle objections', 'Close with confidence']
      },
      {
        id: 'email-marketing',
        title: 'Email Marketing Bootcamp',
        description: 'Build and nurture your email list with automated sequences that convert.',
        format: 'workshop',
        duration: '3 hours',
        level: 'beginner',
        url: 'https://learn.gfunnel.com/workshops/email-marketing',
        outcomes: ['Build email list', 'Write converting emails', 'Set up automations']
      },
      {
        id: 'paid-advertising',
        title: 'Paid Advertising Essentials',
        description: 'Launch profitable ad campaigns on Facebook, Instagram, and Google.',
        format: 'course',
        duration: '6 hours',
        level: 'intermediate',
        url: 'https://learn.gfunnel.com/courses/paid-ads',
        outcomes: ['Set up ad campaigns', 'Target effectively', 'Optimize for ROI']
      },
      {
        id: 'funnel-building',
        title: 'Sales Funnel Blueprint',
        description: 'Design and build high-converting sales funnels for your products and services.',
        format: 'live-training',
        duration: '2 hours',
        level: 'intermediate',
        url: 'https://learn.gfunnel.com/live/funnel-blueprint',
        outcomes: ['Funnel strategy', 'Page design', 'Conversion optimization']
      }
    ],
    instructors: [
      {
        name: 'Jessica Martinez',
        title: 'Digital Marketing Strategist',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
        bio: 'Generated $50M+ in revenue for clients through digital marketing strategies.',
        expertise: ['Paid Advertising', 'Funnel Design', 'Conversion Optimization']
      },
      {
        name: 'Robert Kim',
        title: 'Sales Trainer',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
        bio: 'Trained 2,000+ sales professionals. Former VP of Sales at Fortune 500 company.',
        expertise: ['Consultative Selling', 'Sales Process', 'Team Training']
      }
    ],
    upcomingSessions: [
      {
        title: 'Email Marketing Bootcamp',
        duration: '2 hours',
        format: 'webinar',
        registrationUrl: 'https://learn.gfunnel.com/register/email-bootcamp'
      },
      {
        title: 'Sales Funnel Blueprint LIVE',
        duration: '90 min',
        format: 'webinar',
        registrationUrl: 'https://learn.gfunnel.com/register/funnel-live'
      }
    ],
    resources: [
      { title: 'Marketing Calendar Template', type: 'template', url: '#', icon: '📅' },
      { title: 'Email Swipe Files', type: 'template', url: '#', icon: '📧' },
      { title: 'Sales Script Templates', type: 'template', url: '#', icon: '🎤' },
      { title: 'Ad Copy Formulas', type: 'guide', url: '#', icon: '✍️' }
    ]
  },
  {
    slug: 'finance-accounting',
    externalSlug: 'master-your-money',
    videoHash: '694e18b859742',
    name: 'Finance & Accounting',
    icon: '💰',
    tagline: 'Master your money',
    description: 'Understand business finances, manage cash flow, and make smart financial decisions for growth.',
    color: 'orange',
    modules: [
      {
        id: 'financial-literacy',
        title: 'Business Financial Literacy',
        description: 'Essential financial concepts every entrepreneur must know - profit, cash flow, margins, and more.',
        format: 'course',
        duration: '3 hours',
        level: 'beginner',
        url: 'https://learn.gfunnel.com/courses/financial-literacy',
        outcomes: ['Read financial statements', 'Understand key metrics', 'Make data-driven decisions']
      },
      {
        id: 'bookkeeping-basics',
        title: 'Bookkeeping for Non-Accountants',
        description: 'Set up and maintain your books without needing an accounting degree.',
        format: 'workshop',
        duration: '3 hours',
        level: 'beginner',
        url: 'https://learn.gfunnel.com/workshops/bookkeeping',
        outcomes: ['Set up chart of accounts', 'Track income/expenses', 'Prepare for taxes']
      },
      {
        id: 'pricing-strategies',
        title: 'Pricing Your Products & Services',
        description: 'Develop pricing strategies that maximize profit while remaining competitive.',
        format: 'live-training',
        duration: '90 minutes',
        level: 'beginner',
        url: 'https://learn.gfunnel.com/live/pricing',
        outcomes: ['Value-based pricing', 'Cost analysis', 'Pricing psychology']
      },
      {
        id: 'cash-flow-management',
        title: 'Cash Flow Mastery',
        description: 'Never run out of cash again. Learn to forecast, manage, and optimize cash flow.',
        format: 'masterclass',
        duration: '4 hours',
        level: 'intermediate',
        url: 'https://learn.gfunnel.com/masterclass/cash-flow',
        outcomes: ['Cash flow forecasting', 'Working capital management', 'Crisis prevention']
      },
      {
        id: 'tax-planning',
        title: 'Tax Planning for Entrepreneurs',
        description: 'Legal strategies to minimize your tax burden and keep more of what you earn.',
        format: 'course',
        duration: '2.5 hours',
        level: 'intermediate',
        url: 'https://learn.gfunnel.com/courses/tax-planning',
        outcomes: ['Tax deduction strategies', 'Quarterly estimates', 'Entity tax benefits']
      }
    ],
    instructors: [
      {
        name: 'Amanda Foster',
        title: 'CPA & Business Finance Coach',
        avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&h=150&fit=crop',
        bio: 'CPA with 18 years experience helping small businesses thrive financially.',
        expertise: ['Tax Strategy', 'Financial Planning', 'Bookkeeping Systems']
      }
    ],
    upcomingSessions: [
      {
        title: 'Bookkeeping Workshop',
        duration: '60 min',
        format: 'webinar',
        registrationUrl: 'https://learn.gfunnel.com/register/bookkeeping'
      }
    ],
    resources: [
      { title: 'Budget Template', type: 'template', url: '#', icon: '📊' },
      { title: 'Cash Flow Spreadsheet', type: 'template', url: '#', icon: '💵' },
      { title: 'Tax Deduction Checklist', type: 'checklist', url: '#', icon: '✅' },
      { title: 'Profit Margin Calculator', type: 'template', url: '#', icon: '🔢' }
    ]
  },
  {
    slug: 'operations-systems',
    externalSlug: 'build-a-business-that-runs-without-you',
    videoHash: '694e1920ba17e',
    name: 'Operations & Systems',
    icon: '⚙️',
    tagline: 'Build a business that runs without you',
    description: 'Create efficient systems, automate workflows, and build operations that scale.',
    color: 'teal',
    modules: [
      {
        id: 'systems-thinking',
        title: 'Systems Thinking for Business',
        description: 'Learn to see your business as a system and identify leverage points for improvement.',
        format: 'course',
        duration: '2 hours',
        level: 'beginner',
        url: 'https://learn.gfunnel.com/courses/systems-thinking',
        outcomes: ['Map business processes', 'Identify bottlenecks', 'Design for efficiency']
      },
      {
        id: 'sop-creation',
        title: 'Creating SOPs That Actually Work',
        description: 'Document your processes so anyone can follow them and get consistent results.',
        format: 'workshop',
        duration: '2.5 hours',
        level: 'beginner',
        url: 'https://learn.gfunnel.com/workshops/sop-creation',
        outcomes: ['Write clear SOPs', 'Create training materials', 'Build process library']
      },
      {
        id: 'automation-essentials',
        title: 'Business Automation Essentials',
        description: 'Automate repetitive tasks using Zapier, Make, and other no-code tools.',
        format: 'course',
        duration: '4 hours',
        level: 'intermediate',
        url: 'https://learn.gfunnel.com/courses/automation',
        outcomes: ['Identify automation opportunities', 'Build workflows', 'Connect your tools']
      },
      {
        id: 'project-management',
        title: 'Project Management for Small Teams',
        description: 'Manage projects effectively without overwhelming complexity.',
        format: 'live-training',
        duration: '90 minutes',
        level: 'beginner',
        url: 'https://learn.gfunnel.com/live/project-management',
        outcomes: ['Project planning', 'Team coordination', 'Deadline management']
      },
      {
        id: 'tool-stack',
        title: 'Building Your Tech Stack',
        description: 'Choose and integrate the right tools for your business without overspending.',
        format: 'masterclass',
        duration: '3 hours',
        level: 'intermediate',
        url: 'https://learn.gfunnel.com/masterclass/tech-stack',
        outcomes: ['Evaluate tools objectively', 'Integration strategy', 'Avoid tool overload']
      }
    ],
    instructors: [
      {
        name: 'Michael Thompson',
        title: 'Operations Consultant',
        avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop',
        bio: 'Helped 200+ businesses systematize operations and reduce owner dependency.',
        expertise: ['Process Design', 'Automation', 'Scaling Operations']
      }
    ],
    upcomingSessions: [
      {
        title: 'SOP Creation Workshop',
        duration: '75 min',
        format: 'webinar',
        registrationUrl: 'https://learn.gfunnel.com/register/sop-workshop'
      }
    ],
    resources: [
      { title: 'SOP Template Library', type: 'template', url: '#', icon: '📚' },
      { title: 'Automation Checklist', type: 'checklist', url: '#', icon: '🤖' },
      { title: 'Tool Comparison Guide', type: 'guide', url: '#', icon: '🛠️' },
      { title: 'Process Map Templates', type: 'template', url: '#', icon: '🗺️' }
    ]
  },
  {
    slug: 'leadership-growth',
    externalSlug: 'scale-yourself-and-your-team',
    videoHash: '694e19a7c06b3',
    name: 'Leadership & Growth',
    icon: '🌟',
    tagline: 'Grow yourself, grow your business',
    description: 'Develop leadership skills, build your team, and create a vision for sustainable growth.',
    color: 'pink',
    modules: [
      {
        id: 'entrepreneur-mindset',
        title: 'The Entrepreneur Mindset',
        description: 'Develop the mental frameworks and habits of successful entrepreneurs.',
        format: 'course',
        duration: '3 hours',
        level: 'beginner',
        url: 'https://learn.gfunnel.com/courses/mindset',
        outcomes: ['Overcome limiting beliefs', 'Build resilience', 'Develop growth mindset']
      },
      {
        id: 'first-hire',
        title: 'Making Your First Hire',
        description: 'When, who, and how to hire your first team member the right way.',
        format: 'workshop',
        duration: '2.5 hours',
        level: 'beginner',
        url: 'https://learn.gfunnel.com/workshops/first-hire',
        outcomes: ['Hiring process', 'Job descriptions', 'Onboarding new team']
      },
      {
        id: 'delegation-mastery',
        title: 'Delegation Mastery',
        description: 'Learn to delegate effectively so you can focus on high-value activities.',
        format: 'live-training',
        duration: '90 minutes',
        level: 'intermediate',
        url: 'https://learn.gfunnel.com/live/delegation',
        outcomes: ['What to delegate', 'How to delegate', 'Follow-up systems']
      },
      {
        id: 'team-leadership',
        title: 'Leading a Growing Team',
        description: 'Leadership skills for managing 2-20 people as your business scales.',
        format: 'masterclass',
        duration: '5 hours',
        level: 'intermediate',
        url: 'https://learn.gfunnel.com/masterclass/team-leadership',
        outcomes: ['Team communication', 'Performance management', 'Culture building']
      },
      {
        id: 'strategic-planning',
        title: 'Strategic Planning for Growth',
        description: 'Create a clear vision and strategic plan to reach your next revenue milestone.',
        format: 'course',
        duration: '3 hours',
        level: 'intermediate',
        url: 'https://learn.gfunnel.com/courses/strategic-planning',
        outcomes: ['Vision setting', 'Goal framework', '90-day planning']
      }
    ],
    instructors: [
      {
        name: 'Dr. Lisa Wang',
        title: 'Leadership Coach',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop',
        bio: 'Executive coach and organizational psychologist. Author of "The Founder\'s Journey".',
        expertise: ['Leadership Development', 'Team Building', 'Strategic Thinking']
      },
      {
        name: 'Chris Anderson',
        title: 'Scaling Expert',
        avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop',
        bio: 'Scaled 2 companies from $0 to $10M. Now helps others do the same.',
        expertise: ['Business Scaling', 'Hiring', 'Operations']
      }
    ],
    upcomingSessions: [
      {
        title: 'First Hire Workshop',
        duration: '60 min',
        format: 'webinar',
        registrationUrl: 'https://learn.gfunnel.com/register/first-hire'
      },
      {
        title: 'Delegation Q&A Live',
        duration: '45 min',
        format: 'webinar',
        registrationUrl: 'https://learn.gfunnel.com/register/delegation-qa'
      }
    ],
    resources: [
      { title: 'Hiring Templates', type: 'template', url: '#', icon: '👔' },
      { title: 'Leadership Book List', type: 'guide', url: '#', icon: '📚' },
      { title: 'Strategic Plan Template', type: 'template', url: '#', icon: '🎯' },
      { title: 'Founders Community', type: 'community', url: '#', icon: '👥' }
    ]
  },
  {
    slug: 'software-tools',
    externalSlug: 'master-the-tools-that-power-your-business',
    videoHash: '694e19f08c30f',
    name: 'Software & Tools',
    icon: '🛠️',
    tagline: 'Master the tools that power your business',
    description: 'Learn how to use the essential software, platforms, and services that help you run, automate, and grow your business.',
    color: 'indigo',
    modules: [
      {
        id: 'crm-essentials',
        title: 'CRM Essentials',
        description: 'Master customer relationship management tools to organize leads, track conversations, and close more deals.',
        format: 'course',
        duration: '2.5 hours',
        level: 'beginner',
        url: 'https://learn.gfunnel.com/courses/crm-essentials',
        outcomes: ['Set up your CRM', 'Organize contacts & pipelines', 'Automate follow-ups']
      },
      {
        id: 'email-platforms',
        title: 'Email Marketing Platforms',
        description: 'Compare and master popular email tools like Mailchimp, ConvertKit, and ActiveCampaign.',
        format: 'workshop',
        duration: '3 hours',
        level: 'beginner',
        url: 'https://learn.gfunnel.com/workshops/email-platforms',
        outcomes: ['Choose the right platform', 'Build email automations', 'Segment your audience']
      },
      {
        id: 'website-funnel-builders',
        title: 'Website & Funnel Builders',
        description: 'Build professional websites and high-converting funnels without coding skills.',
        format: 'course',
        duration: '4 hours',
        level: 'beginner',
        url: 'https://learn.gfunnel.com/courses/funnel-builders',
        outcomes: ['Build landing pages', 'Create sales funnels', 'Optimize for conversions']
      },
      {
        id: 'payment-invoicing',
        title: 'Payment & Invoicing Tools',
        description: 'Set up payment processing, invoicing, and billing systems for your business.',
        format: 'live-training',
        duration: '90 minutes',
        level: 'beginner',
        url: 'https://learn.gfunnel.com/live/payment-tools',
        outcomes: ['Accept payments online', 'Create professional invoices', 'Automate billing']
      },
      {
        id: 'project-management',
        title: 'Project Management Software',
        description: 'Stay organized and productive with tools like Asana, Trello, ClickUp, and Notion.',
        format: 'course',
        duration: '2 hours',
        level: 'beginner',
        url: 'https://learn.gfunnel.com/courses/project-management',
        outcomes: ['Choose the right tool', 'Set up workflows', 'Collaborate with your team']
      },
      {
        id: 'ai-tools-entrepreneurs',
        title: 'AI Tools for Entrepreneurs',
        description: 'Leverage AI to write content, automate tasks, analyze data, and work smarter.',
        format: 'masterclass',
        duration: '3 hours',
        level: 'intermediate',
        url: 'https://learn.gfunnel.com/masterclass/ai-tools',
        outcomes: ['Use AI for content creation', 'Automate with AI', 'AI-powered decision making']
      }
    ],
    instructors: [
      {
        name: 'Kevin Torres',
        title: 'Tech Integration Specialist',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop',
        bio: 'Helped 300+ businesses implement and integrate their tech stack for maximum efficiency.',
        expertise: ['CRM Systems', 'Marketing Automation', 'Tech Stack Design']
      }
    ],
    upcomingSessions: [
      {
        title: 'AI Tools Demo',
        duration: '60 min',
        format: 'webinar',
        registrationUrl: 'https://learn.gfunnel.com/register/ai-tools-demo'
      },
      {
        title: 'CRM Setup Workshop',
        duration: '75 min',
        format: 'webinar',
        registrationUrl: 'https://learn.gfunnel.com/register/crm-setup'
      }
    ],
    resources: [
      { title: 'Tech Stack Comparison Guide', type: 'guide', url: '#', icon: '📊' },
      { title: 'Software Setup Checklist', type: 'checklist', url: '#', icon: '✅' },
      { title: 'Integration Templates', type: 'template', url: '#', icon: '🔗' },
      { title: 'AI Prompt Library', type: 'template', url: '#', icon: '🤖' }
    ]
  },
  {
    slug: 'strategy',
    externalSlug: 'proven-strategies-for-faster-results',
    videoHash: '694e1a1bdba2c',
    name: 'Strategy',
    icon: '🎯',
    tagline: 'Proven strategies for faster results',
    description: 'Discover unique, actionable strategies for automation, marketing, growth, and more—created by entrepreneurs who\'ve done it.',
    color: 'cyan',
    modules: [
      {
        id: 'automation-playbook',
        title: 'Automation Strategy Playbook',
        description: 'Build automated systems that save time and scale your business without burning out.',
        format: 'masterclass',
        duration: '4 hours',
        level: 'intermediate',
        url: 'https://learn.gfunnel.com/masterclass/automation-strategy',
        outcomes: ['Identify automation opportunities', 'Build automated workflows', 'Scale without extra effort']
      },
      {
        id: 'content-marketing-strategy',
        title: 'Content Marketing Strategy',
        description: 'Create a content engine that attracts leads and builds authority in your niche.',
        format: 'course',
        duration: '3.5 hours',
        level: 'beginner',
        url: 'https://learn.gfunnel.com/courses/content-strategy',
        outcomes: ['Content planning', 'Repurposing strategies', 'Building authority']
      },
      {
        id: 'lead-generation-strategies',
        title: 'Lead Generation Strategies',
        description: 'Proven tactics to generate a consistent flow of qualified leads for your business.',
        format: 'live-training',
        duration: '2 hours',
        level: 'beginner',
        url: 'https://learn.gfunnel.com/live/lead-gen-strategies',
        outcomes: ['Lead magnet creation', 'Traffic sources', 'Lead nurturing sequences']
      },
      {
        id: 'growth-hacking',
        title: 'Growth Hacking Tactics',
        description: 'Unconventional strategies used by fast-growing startups to acquire customers quickly.',
        format: 'workshop',
        duration: '3 hours',
        level: 'intermediate',
        url: 'https://learn.gfunnel.com/workshops/growth-hacking',
        outcomes: ['Viral loops', 'Referral programs', 'Rapid experimentation']
      },
      {
        id: 'pricing-strategy-masterclass',
        title: 'Pricing Strategy Masterclass',
        description: 'Strategic pricing approaches that maximize revenue and position you as premium.',
        format: 'masterclass',
        duration: '3 hours',
        level: 'intermediate',
        url: 'https://learn.gfunnel.com/masterclass/pricing-strategy',
        outcomes: ['Value-based pricing', 'Price anchoring', 'Premium positioning']
      },
      {
        id: 'customer-retention',
        title: 'Customer Retention Strategies',
        description: 'Keep customers longer and increase lifetime value with proven retention tactics.',
        format: 'course',
        duration: '2.5 hours',
        level: 'intermediate',
        url: 'https://learn.gfunnel.com/courses/retention-strategies',
        outcomes: ['Reduce churn', 'Increase LTV', 'Build loyalty programs']
      }
    ],
    instructors: [
      {
        name: 'Rachel Green',
        title: 'Growth Strategist',
        avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop',
        bio: 'Helped 100+ startups achieve 10x growth through strategic marketing and automation.',
        expertise: ['Growth Strategy', 'Marketing Automation', 'Customer Acquisition']
      },
      {
        name: 'Daniel Okonkwo',
        title: 'Automation Expert',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
        bio: 'Built automated systems that generate $5M+ annually for clients.',
        expertise: ['Business Automation', 'Systems Design', 'Workflow Optimization']
      }
    ],
    upcomingSessions: [
      {
        title: 'Automation Strategy Deep Dive',
        duration: '90 min',
        format: 'webinar',
        registrationUrl: 'https://learn.gfunnel.com/register/automation-deep-dive'
      },
      {
        title: 'Lead Gen Strategy Session',
        duration: '60 min',
        format: 'webinar',
        registrationUrl: 'https://learn.gfunnel.com/register/lead-gen-session'
      }
    ],
    resources: [
      { title: 'Strategy Playbook Templates', type: 'template', url: '#', icon: '📋' },
      { title: 'Automation Workflow Diagrams', type: 'template', url: '#', icon: '⚡' },
      { title: 'Growth Experiment Tracker', type: 'template', url: '#', icon: '📈' },
      { title: 'Strategy Community', type: 'community', url: '#', icon: '🧠' }
    ]
  },
  {
    slug: 'other',
    externalSlug: 'explore',
    videoHash: '',
    name: 'Explore More',
    icon: '🧭',
    tagline: 'Discover more resources',
    description: 'Explore our full library of tools, resources, and training to help you build and grow your business.',
    color: 'slate',
    modules: [],
    instructors: [],
    upcomingSessions: [],
    resources: []
  }
];

export const getTopicBySlug = (slug: string): LearningTopic | undefined => {
  return learningTopics.find((topic) => topic.slug === slug);
};

export const getTopicColorClasses = (color: string): { bg: string; border: string; text: string } => {
  const colorMap: Record<string, { bg: string; border: string; text: string }> = {
    blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-500' },
    purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-500' },
    green: { bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-500' },
    orange: { bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-500' },
    teal: { bg: 'bg-teal-500/10', border: 'border-teal-500/30', text: 'text-teal-500' },
    pink: { bg: 'bg-pink-500/10', border: 'border-pink-500/30', text: 'text-pink-500' },
    slate: { bg: 'bg-slate-500/10', border: 'border-slate-500/30', text: 'text-slate-500' },
    indigo: { bg: 'bg-indigo-500/10', border: 'border-indigo-500/30', text: 'text-indigo-500' },
    cyan: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', text: 'text-cyan-500' },
  };
  return colorMap[color] || colorMap.blue;
};
