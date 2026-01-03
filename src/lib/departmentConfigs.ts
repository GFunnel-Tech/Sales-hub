export interface Role {
  title: string;
  isFilled: boolean;
  description: string;
  responsibilities: string[];
  skills: string[];
}

export interface Resource {
  title: string;
  url: string;
  icon: string;
}

export interface QuickAction {
  title: string;
  icon: string;
  formType: 'request' | 'idea' | 'delegate';
}

export interface CoreAction {
  title: string;
  icon: string;
  type: 'request' | 'idea' | 'delegate';
  description: string;
}

export interface DepartmentConfig {
  slug: string;
  name: string;
  icon: string;
  shortDescription: string;
  overview: string;
  color: string;
  coreActions: CoreAction[];
  quickActions: QuickAction[];
  roles: Role[];
  resources: Resource[];
}

export const departmentConfigs: DepartmentConfig[] = [
  {
    slug: 'starting-a-business',
    name: 'Starting a Business',
    icon: '🚀',
    shortDescription: 'Learn how to launch your business from scratch',
    overview: 'Everything you need to start your entrepreneurial journey - from idea validation to your first customers.',
    color: 'blue',
    coreActions: [
      { title: 'Access Startup Course', icon: '📚', type: 'request', description: 'Start the Business Startup program' },
      { title: 'Join Startup Workshop', icon: '👥', type: 'idea', description: 'Attend live startup sessions' },
      { title: 'Get 1-on-1 Guidance', icon: '🎯', type: 'delegate', description: 'Schedule mentorship session' },
    ],
    quickActions: [
      { title: 'Business Idea Validation', icon: '💡', formType: 'request' },
      { title: 'Business Model Canvas', icon: '📋', formType: 'request' },
      { title: 'Market Research Basics', icon: '🔍', formType: 'request' },
      { title: 'Finding Your Niche', icon: '🎯', formType: 'request' },
      { title: 'MVP Development', icon: '⚡', formType: 'idea' },
      { title: 'First Customer Strategy', icon: '🤝', formType: 'request' },
    ],
    roles: [],
    resources: [
      { title: 'Startup Checklist', url: '#', icon: '✅' },
      { title: 'Business Plan Template', url: '#', icon: '📝' },
      { title: 'Founder Stories', url: '#', icon: '🎙️' },
      { title: 'Resource Library', url: '#', icon: '📚' },
    ],
  },
  {
    slug: 'legal-registration',
    name: 'Legal & Registration',
    icon: '📋',
    shortDescription: 'Business registration and legal compliance',
    overview: 'Navigate the legal requirements of starting a business including LLC formation, licensing, and compliance.',
    color: 'purple',
    coreActions: [
      { title: 'Registration Workshop', icon: '🏛️', type: 'request', description: 'Learn business registration' },
      { title: 'Legal Structure Guide', icon: '📖', type: 'idea', description: 'Choose the right entity' },
      { title: 'Compliance Checklist', icon: '✅', type: 'delegate', description: 'Stay legally protected' },
    ],
    quickActions: [
      { title: 'LLC Formation Guide', icon: '🏢', formType: 'request' },
      { title: 'EIN Application', icon: '🔢', formType: 'request' },
      { title: 'Business Licensing', icon: '📜', formType: 'request' },
      { title: 'Trademark Basics', icon: '™️', formType: 'idea' },
      { title: 'Contracts 101', icon: '✍️', formType: 'request' },
      { title: 'Tax Structure', icon: '💰', formType: 'request' },
    ],
    roles: [],
    resources: [
      { title: 'Registration Checklist', url: '#', icon: '✅' },
      { title: 'Legal Templates', url: '#', icon: '📄' },
      { title: 'State Requirements', url: '#', icon: '🗺️' },
      { title: 'FAQ Library', url: '#', icon: '❓' },
    ],
  },
  {
    slug: 'marketing-sales',
    name: 'Marketing & Sales',
    icon: '📈',
    shortDescription: 'Attract customers and grow your revenue',
    overview: 'Master marketing and sales strategies to attract, convert, and retain customers for sustainable growth.',
    color: 'green',
    coreActions: [
      { title: 'Marketing Course', icon: '📚', type: 'request', description: 'Learn marketing fundamentals' },
      { title: 'Sales Masterclass', icon: '🎓', type: 'idea', description: 'Close more deals' },
      { title: 'Growth Workshop', icon: '📊', type: 'delegate', description: 'Scale your business' },
    ],
    quickActions: [
      { title: 'Brand Strategy', icon: '🎨', formType: 'request' },
      { title: 'Social Media Marketing', icon: '📱', formType: 'request' },
      { title: 'Email Marketing', icon: '📧', formType: 'request' },
      { title: 'Sales Funnels', icon: '🔄', formType: 'idea' },
      { title: 'Content Marketing', icon: '✍️', formType: 'request' },
      { title: 'Paid Advertising', icon: '📢', formType: 'request' },
    ],
    roles: [],
    resources: [
      { title: 'Marketing Playbook', url: '#', icon: '📖' },
      { title: 'Sales Scripts', url: '#', icon: '🎤' },
      { title: 'Campaign Templates', url: '#', icon: '📝' },
      { title: 'Analytics Guide', url: '#', icon: '📊' },
    ],
  },
  {
    slug: 'finance-accounting',
    name: 'Finance & Accounting',
    icon: '💰',
    shortDescription: 'Master your business finances',
    overview: 'Understand business finances, manage cash flow, and make smart financial decisions for your business.',
    color: 'orange',
    coreActions: [
      { title: 'Financial Literacy Course', icon: '📚', type: 'request', description: 'Master business finance' },
      { title: 'Bookkeeping Workshop', icon: '📒', type: 'idea', description: 'Learn accounting basics' },
      { title: 'Tax Planning Session', icon: '🧾', type: 'delegate', description: 'Optimize your taxes' },
    ],
    quickActions: [
      { title: 'Budgeting Basics', icon: '📊', formType: 'request' },
      { title: 'Cash Flow Management', icon: '💵', formType: 'request' },
      { title: 'Pricing Strategies', icon: '🏷️', formType: 'request' },
      { title: 'Financial Projections', icon: '📈', formType: 'idea' },
      { title: 'Profit Margins', icon: '📐', formType: 'request' },
      { title: 'Funding Options', icon: '🏦', formType: 'request' },
    ],
    roles: [],
    resources: [
      { title: 'Budget Templates', url: '#', icon: '📝' },
      { title: 'Financial Calculators', url: '#', icon: '🔢' },
      { title: 'Tax Checklists', url: '#', icon: '✅' },
      { title: 'Investor Pitch Deck', url: '#', icon: '🎯' },
    ],
  },
  {
    slug: 'operations-systems',
    name: 'Operations & Systems',
    icon: '⚙️',
    shortDescription: 'Build efficient business operations',
    overview: 'Create systems and processes that allow your business to run smoothly and scale effectively.',
    color: 'teal',
    coreActions: [
      { title: 'Systems Workshop', icon: '🔧', type: 'request', description: 'Build business systems' },
      { title: 'Automation Training', icon: '🤖', type: 'idea', description: 'Automate repetitive tasks' },
      { title: 'Process Optimization', icon: '📋', type: 'delegate', description: 'Streamline operations' },
    ],
    quickActions: [
      { title: 'SOP Development', icon: '📖', formType: 'request' },
      { title: 'Tool Stack Setup', icon: '🛠️', formType: 'request' },
      { title: 'Workflow Automation', icon: '⚡', formType: 'request' },
      { title: 'Project Management', icon: '📅', formType: 'idea' },
      { title: 'Team Collaboration', icon: '👥', formType: 'request' },
      { title: 'Quality Control', icon: '✓', formType: 'request' },
    ],
    roles: [],
    resources: [
      { title: 'SOP Templates', url: '#', icon: '📝' },
      { title: 'Tool Recommendations', url: '#', icon: '🛠️' },
      { title: 'Automation Guides', url: '#', icon: '🤖' },
      { title: 'Process Maps', url: '#', icon: '🗺️' },
    ],
  },
  {
    slug: 'leadership-growth',
    name: 'Leadership & Growth',
    icon: '🌟',
    shortDescription: 'Develop as a leader and scale your team',
    overview: 'Grow as an entrepreneur, build leadership skills, and learn how to scale your team and business.',
    color: 'pink',
    coreActions: [
      { title: 'Leadership Masterclass', icon: '🎓', type: 'request', description: 'Become a better leader' },
      { title: 'Team Building Workshop', icon: '👥', type: 'idea', description: 'Build your dream team' },
      { title: 'Scaling Strategy', icon: '📈', type: 'delegate', description: 'Plan for growth' },
    ],
    quickActions: [
      { title: 'Hiring Essentials', icon: '👔', formType: 'request' },
      { title: 'Delegation Skills', icon: '📤', formType: 'request' },
      { title: 'Time Management', icon: '⏰', formType: 'request' },
      { title: 'Vision & Strategy', icon: '🎯', formType: 'idea' },
      { title: 'Mindset & Resilience', icon: '🧠', formType: 'request' },
      { title: 'Networking Skills', icon: '🤝', formType: 'request' },
    ],
    roles: [],
    resources: [
      { title: 'Leadership Books', url: '#', icon: '📚' },
      { title: 'Hiring Templates', url: '#', icon: '📝' },
      { title: 'Goal Setting Framework', url: '#', icon: '🎯' },
      { title: 'Mentor Network', url: '#', icon: '👥' },
    ],
  },
];

export const getDepartmentBySlug = (slug: string): DepartmentConfig | undefined => {
  return departmentConfigs.find((dept) => dept.slug === slug);
};

export const getDepartmentColorClasses = (color: string): { bg: string; border: string; text: string } => {
  const colorMap: Record<string, { bg: string; border: string; text: string }> = {
    blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-500' },
    purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-500' },
    green: { bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-500' },
    orange: { bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-500' },
    teal: { bg: 'bg-teal-500/10', border: 'border-teal-500/30', text: 'text-teal-500' },
    pink: { bg: 'bg-pink-500/10', border: 'border-pink-500/30', text: 'text-pink-500' },
  };
  return colorMap[color] || colorMap.blue;
};
