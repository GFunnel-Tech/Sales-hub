import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DepartmentConfig, Role, getDepartmentColorClasses } from '@/lib/departmentConfigs';
import { UserPlus, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RolesStructureProps {
  department: DepartmentConfig;
  onHireClick: (role: Role) => void;
}

const colorHoverClasses: Record<string, string> = {
  blue: 'hover:border-blue-500/30',
  purple: 'hover:border-purple-500/30',
  green: 'hover:border-green-500/30',
  orange: 'hover:border-orange-500/30',
  teal: 'hover:border-teal-500/30',
  pink: 'hover:border-pink-500/30',
};

const colorBgClasses: Record<string, string> = {
  blue: 'bg-blue-500/10',
  purple: 'bg-purple-500/10',
  green: 'bg-green-500/10',
  orange: 'bg-orange-500/10',
  teal: 'bg-teal-500/10',
  pink: 'bg-pink-500/10',
};

const colorTextClasses: Record<string, string> = {
  blue: 'text-blue-500',
  purple: 'text-purple-500',
  green: 'text-green-500',
  orange: 'text-orange-500',
  teal: 'text-teal-500',
  pink: 'text-pink-500',
};

export const RolesStructure = ({ department, onHireClick }: RolesStructureProps) => {
  const [expandedRole, setExpandedRole] = useState<number | null>(null);
  const colorClasses = getDepartmentColorClasses(department.color);
  const hoverClass = colorHoverClasses[department.color] || colorHoverClasses.blue;
  const bgClass = colorBgClasses[department.color] || colorBgClasses.blue;
  const textClass = colorTextClasses[department.color] || colorTextClasses.blue;

  const toggleRole = (index: number) => {
    setExpandedRole(expandedRole === index ? null : index);
  };

  return (
    <div className="space-y-3">
      {department.roles.map((role, index) => (
        <div
          key={index}
          className={cn(
            'rounded-lg border border-border/50 bg-card/50 transition-all duration-200',
            hoverClass
          )}
        >
          {/* Role Header */}
          <div
            className="flex items-center justify-between p-4 cursor-pointer"
            onClick={() => toggleRole(index)}
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div
                className={cn(
                  'w-2 h-2 rounded-full flex-shrink-0',
                  role.isFilled ? 'bg-green-500' : 'bg-muted-foreground/30'
                )}
              />
              <span className="text-foreground font-medium truncate">{role.title}</span>
              {expandedRole === index ? (
                <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              ) : (
                <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onHireClick(role);
              }}
              className={cn('gap-2 flex-shrink-0 ml-2', textClass)}
            >
              <UserPlus className="w-4 h-4" />
              <span className="hidden sm:inline">Hire</span>
            </Button>
          </div>

          {/* Expanded Details */}
          {expandedRole === index && (
            <div className="px-4 pb-4 pt-0 space-y-4 border-t border-border/30">
              {/* Description */}
              <div className="pt-4">
                <p className="text-sm text-muted-foreground">{role.description}</p>
              </div>

              {/* Responsibilities */}
              <div>
                <h4 className={cn('text-sm font-medium mb-2', textClass)}>Responsibilities</h4>
                <ul className="space-y-1">
                  {role.responsibilities.map((resp, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className={cn('mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0', bgClass)} />
                      {resp}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Skills */}
              <div>
                <h4 className={cn('text-sm font-medium mb-2', textClass)}>Skills & Characteristics</h4>
                <div className="flex flex-wrap gap-2">
                  {role.skills.map((skill, i) => (
                    <span
                      key={i}
                      className={cn(
                        'text-xs px-2 py-1 rounded-full',
                        bgClass,
                        textClass
                      )}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
