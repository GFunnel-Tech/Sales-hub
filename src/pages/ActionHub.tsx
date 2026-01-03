import { Eyebrow } from '@/components/ui/eyebrow';
import { Button } from '@/components/ui/button';
import { TopicCard } from '@/components/TopicCard';
import { learningTopics } from '@/lib/learningConfig';
import { Calendar, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ActionHub = () => {

  // Get all upcoming sessions across topics
  const allUpcomingSessions = learningTopics.flatMap(topic => 
    topic.upcomingSessions.map(session => ({
      ...session,
      topicName: topic.name,
      topicSlug: topic.slug,
      topicIcon: topic.icon
    }))
  );

  const upcomingCategories = [
    { title: 'Upcoming Events', icon: '📅', slug: 'events' },
    { title: 'Upcoming Workshops', icon: '🛠️', slug: 'workshops' },
    { title: 'Upcoming Summits', icon: '🏔️', slug: 'summits' },
    { title: 'Upcoming Q&As', icon: '💬', slug: 'qas' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 py-4">
        <div className="container mx-auto px-4 flex items-center justify-end gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1">
                Programs
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 max-h-[400px] overflow-y-auto bg-popover">
              <DropdownMenuItem asChild>
                <Link to="/learning-hub" className="cursor-pointer font-medium text-accent">
                  Learning Hub
                </Link>
              </DropdownMenuItem>
              {learningTopics.map((topic) => (
                <DropdownMenuItem key={topic.slug} asChild>
                  <Link to={`/learning-hub/${topic.slug}`} className="cursor-pointer text-sm">
                    {topic.name}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="gradient" className="gap-2" asChild>
            <a href="https://www.gfunnel.com/discover" target="_blank" rel="noopener noreferrer">
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Schedule Discovery</span>
            </a>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <Eyebrow>Business & Entrepreneur University</Eyebrow>
            <h1 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
              <span className="gradient-text">Learning Hub</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Choose a topic to explore courses, workshops, live trainings, and resources 
              designed to help you build and grow your business.
            </p>
          </div>

          {/* Learning Topics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {learningTopics.map(topic => (
              <TopicCard key={topic.slug} topic={topic} />
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Categories */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {upcomingCategories.map((category) => (
              <div 
                key={category.slug}
                className="bg-card border border-border rounded-lg p-6 text-center hover:border-accent/50 transition-colors cursor-pointer"
              >
                <span className="text-3xl mb-3 block">{category.icon}</span>
                <h3 className="font-medium text-sm">{category.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-12 bg-gradient-to-br from-primary to-secondary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-3">
            Not Sure Where to Start?
          </h2>
          <p className="text-primary-foreground/80 mb-6 max-w-xl mx-auto">
            Schedule a free consultation and we'll help you find the perfect learning path for your business goals.
          </p>
          <Button 
            variant="gradient-secondary" 
            size="lg" 
            className="gap-2"
            onClick={() => window.open('https://www.GFunnel.com/discover', '_blank')}
          >
            <Calendar className="w-5 h-5" />
            Schedule Free Consultation
          </Button>
        </div>
      </section>
    </div>
  );
};

export default ActionHub;