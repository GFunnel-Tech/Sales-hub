import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Play, Calendar, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getTopicBySlug, getTopicColorClasses, LearningModule } from '@/lib/learningConfig';

type FormatFilter = 'all' | 'course' | 'workshop' | 'live-training' | 'masterclass' | 'resource';

const formatLabels: Record<FormatFilter, string> = {
  'all': 'All',
  'course': 'Courses',
  'workshop': 'Workshops',
  'live-training': 'Live Trainings',
  'masterclass': 'Masterclasses',
  'resource': 'Resources',
};

const formatBadgeStyles: Record<LearningModule['format'], { label: string; className: string }> = {
  'course': { label: 'Course', className: 'bg-blue-100 text-blue-700 border-blue-200' },
  'workshop': { label: 'Workshop', className: 'bg-purple-100 text-purple-700 border-purple-200' },
  'live-training': { label: 'Live Training', className: 'bg-green-100 text-green-700 border-green-200' },
  'event': { label: 'Event', className: 'bg-orange-100 text-orange-700 border-orange-200' },
  'masterclass': { label: 'Masterclass', className: 'bg-amber-100 text-amber-700 border-amber-200' },
  'resource': { label: 'Resource', className: 'bg-slate-100 text-slate-700 border-slate-200' },
};

const levelStyles = {
  'beginner': 'bg-emerald-50 text-emerald-700',
  'intermediate': 'bg-amber-50 text-amber-700',
  'advanced': 'bg-rose-50 text-rose-700',
};

const DepartmentPage = () => {
  const { departmentSlug } = useParams<{ departmentSlug: string }>();
  const topic = getTopicBySlug(departmentSlug || '');
  const [activeFilter, setActiveFilter] = useState<FormatFilter>('all');

  if (!topic) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Topic Not Found</h1>
          <Link to="/learning-hub">
            <Button variant="outline">Back to Learning Hub</Button>
          </Link>
        </div>
      </div>
    );
  }

  const colorClasses = getTopicColorClasses(topic.color);

  // Get available formats from modules
  const availableFormats = [...new Set(topic.modules.map(m => m.format))];
  const filters: FormatFilter[] = ['all', ...availableFormats.filter(f => f !== 'event') as FormatFilter[]];

  // Filter modules
  const filteredModules = activeFilter === 'all' 
    ? topic.modules 
    : topic.modules.filter(m => m.format === activeFilter);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section id="overview" className="py-12 border-b border-border/50 bg-gradient-to-b from-muted/50 to-background">
        <div className="container mx-auto px-4">
          <Link
            to="/learning-hub"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Learning Hub</span>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Left: Topic Info + Stats + CTA */}
            <div className="flex flex-col gap-6">
              {/* Header with icon */}
              <div className="flex items-start gap-5">
                <div
                  className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center text-3xl md:text-4xl ${colorClasses.bg} ${colorClasses.border} border-2 flex-shrink-0 shadow-lg`}
                >
                  {topic.icon}
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-semibold uppercase tracking-wide ${colorClasses.text} mb-2`}>
                    {topic.tagline}
                  </p>
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-3">
                    {topic.name}
                  </h1>
                  <p className="text-base md:text-lg text-muted-foreground">
                    {topic.description}
                  </p>
                </div>
              </div>
              {/* Quick Access */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <a 
                  href={`https://gfunnel.com/view-course-profile/${topic.externalSlug}`}
                  target="_top"
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-card border border-border hover:border-accent/50 hover:shadow-md transition-all duration-300 group"
                >
                  <span className="text-2xl">📋</span>
                  <span className="text-sm font-medium text-foreground group-hover:text-accent transition-colors">Overview</span>
                </a>
                <a 
                  href={`https://gfunnel.com/classes-context/${topic.externalSlug}`}
                  target="_top"
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-card border border-border hover:border-accent/50 hover:shadow-md transition-all duration-300 group"
                >
                  <span className="text-2xl">📚</span>
                  <span className="text-sm font-medium text-foreground group-hover:text-accent transition-colors">Modules</span>
                </a>
                <a 
                  href={`https://gfunnel.com/files-context/${topic.externalSlug}`}
                  target="_top"
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-card border border-border hover:border-accent/50 hover:shadow-md transition-all duration-300 group"
                >
                  <span className="text-2xl">📁</span>
                  <span className="text-sm font-medium text-foreground group-hover:text-accent transition-colors">Files</span>
                </a>
                <a 
                  href={`https://www.gfunnel.com/discover?topic=${topic.slug}`}
                  target="_top"
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-card border border-border hover:border-accent/50 hover:shadow-md transition-all duration-300 group"
                >
                  <span className="text-2xl">🎯</span>
                  <span className="text-sm font-medium text-foreground group-hover:text-accent transition-colors">Need An Expert</span>
                </a>
              </div>

              {/* CTA Button */}
              <Button 
                variant="gradient" 
                size="lg" 
                className="w-full sm:w-auto gap-2 shadow-lg"
                asChild
              >
                <a href={`https://gfunnel.com/view-course-profile/${topic.externalSlug}`} target="_top">
                  Getting Started
                </a>
              </Button>
            </div>

            {/* Right: Video */}
            <div className="flex flex-col gap-4">
              {/* VideoSuite Player */}
              <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg border border-border/50 bg-muted">
                <iframe
                  src={`https://videosuite-player.vercel.app/?hash=${topic.videoHash}&apiUrl=https://videosuite.app&analyticsUrl=https://api.vidanalytics.io&appEnv=live`}
                  title="Overview Video"
                  className="absolute inset-0 w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              {/* Video caption */}
              <p className="text-sm text-muted-foreground text-center">
                Watch the intro to get started
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="border-b border-border/50 bg-background sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-1 py-4 overflow-x-auto">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                  activeFilter === filter
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                {formatLabels[filter]}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Modules Grid */}
      <section id="modules" className="py-10">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredModules.map((module) => {
              const badgeStyle = formatBadgeStyles[module.format];
              return (
                <Card 
                  key={module.id} 
                  className="group hover:shadow-lg hover:border-accent/50 transition-all duration-300 flex flex-col"
                >
                  <CardContent className="p-6 flex flex-col flex-1">
                    {/* Header with badges */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium border ${badgeStyle.className}`}>
                        {badgeStyle.label}
                      </span>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${levelStyles[module.level]}`}>
                        {module.level}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-semibold text-foreground group-hover:text-accent transition-colors mb-2">
                      {module.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
                      {module.description}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-end pt-4 border-t border-border/50">
                      <Button 
                        variant="gradient" 
                        size="sm" 
                        className="gap-2"
                        onClick={() => window.open(module.url, '_blank')}
                      >
                        <Play className="w-3.5 h-3.5" />
                        Access Module
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredModules.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No modules found for this filter.</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setActiveFilter('all')}
              >
                View All Modules
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Upcoming Events Section */}
      {topic.upcomingSessions.length > 0 && (
        <section className="py-10 bg-muted/30 border-t border-border/50">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-accent" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Upcoming Events</h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topic.upcomingSessions.map((session, idx) => (
                <Card key={idx} className="hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <Badge variant="outline" className="mb-3">
                      {session.format}
                    </Badge>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {session.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Duration: {session.duration}
                    </p>
                    <div className="flex gap-3">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex-1"
                        onClick={() => window.open(session.registrationUrl, '_blank')}
                      >
                        View Event
                      </Button>
                      <Button 
                        variant="gradient" 
                        size="sm"
                        className="flex-1 gap-2"
                        onClick={() => window.open(session.registrationUrl, '_blank')}
                      >
                        Register
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Community Section - Hide on "Explore More" page */}
      {topic.slug !== 'other' && (
        <section id="community" className="py-10 border-t border-border/50 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-accent" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Community</h2>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Join the Founder Community</h3>
                  <p className="text-muted-foreground">Connect with fellow entrepreneurs, share experiences, and get support on your journey.</p>
                </div>
                <Button variant="gradient" className="gap-2 flex-shrink-0" asChild>
                  <a href={`https://gfunnel.com/timeline-view/${topic.externalSlug}`} target="_top">
                    Join Community
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default DepartmentPage;
