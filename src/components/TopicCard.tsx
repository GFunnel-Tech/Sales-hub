import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { LearningTopic, getTopicColorClasses } from '@/lib/learningConfig';
import { ArrowRight } from 'lucide-react';

interface TopicCardProps {
  topic: LearningTopic;
}

export const TopicCard = ({ topic }: TopicCardProps) => {
  const colorClasses = getTopicColorClasses(topic.color);

  return (
    <Link to={`/learning-hub/${topic.slug}`}>
      <Card className="group relative overflow-hidden p-6 cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-xl border-border/50 bg-card h-full">
        {/* Color accent bar */}
        <div
          className="absolute top-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `linear-gradient(90deg, ${
              topic.color === 'blue' ? '#3b82f6' :
              topic.color === 'purple' ? '#a855f7' :
              topic.color === 'green' ? '#22c55e' :
              topic.color === 'orange' ? '#f97316' :
              topic.color === 'teal' ? '#14b8a6' :
              topic.color === 'slate' ? '#64748b' :
              '#ec4899'
            }, transparent)`,
          }}
        />

        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-start gap-4 mb-4">
            <div
              className={`flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center text-2xl ${colorClasses.bg} ${colorClasses.border} border`}
            >
              {topic.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-xs font-medium ${colorClasses.text} mb-0.5`}>{topic.tagline}</p>
              <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                {topic.name}
              </h3>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-3 flex-grow mb-4">
            {topic.description}
          </p>

          {/* Access Button */}
          <div className="flex items-center justify-between mt-auto pt-2">
            <span className={`text-sm font-medium ${colorClasses.text} group-hover:underline`}>
              Access {topic.name}
            </span>
            <ArrowRight className={`w-4 h-4 ${colorClasses.text} transition-transform group-hover:translate-x-1`} />
          </div>
        </div>
      </Card>
    </Link>
  );
};
