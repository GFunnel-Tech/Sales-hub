import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { DepartmentConfig, getDepartmentColorClasses } from '@/lib/departmentConfigs';

interface DepartmentCardProps {
  department: DepartmentConfig;
}

export const DepartmentCard = ({ department }: DepartmentCardProps) => {
  const colorClasses = getDepartmentColorClasses(department.color);

  return (
    <Link to={`/learning-hub/${department.slug}`}>
      <Card className="group relative overflow-hidden p-6 cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-xl border-border/50 bg-card">
        {/* Color accent bar */}
        <div
          className={`absolute top-0 left-0 right-0 h-1 ${colorClasses.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
          style={{
            background: `linear-gradient(90deg, ${
              department.color === 'blue' ? '#3b82f6' :
              department.color === 'purple' ? '#a855f7' :
              department.color === 'green' ? '#22c55e' :
              department.color === 'orange' ? '#f97316' :
              department.color === 'teal' ? '#14b8a6' :
              '#ec4899'
            }, transparent)`,
          }}
        />

        <div className="flex items-start gap-4">
          {/* Icon */}
          <div
            className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${colorClasses.bg} ${colorClasses.border} border`}
          >
            {department.icon}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
              {department.name}
            </h3>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {department.shortDescription}
            </p>
          </div>
        </div>

        {/* Hover arrow indicator */}
        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className={`text-lg ${colorClasses.text}`}>→</span>
        </div>
      </Card>
    </Link>
  );
};
