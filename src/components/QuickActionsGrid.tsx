import { Button } from '@/components/ui/button';
import { DepartmentConfig, QuickAction, getDepartmentColorClasses } from '@/lib/departmentConfigs';
import { cn } from '@/lib/utils';

interface QuickActionsGridProps {
  department: DepartmentConfig;
  onActionClick: (action: QuickAction) => void;
}

const colorHoverClasses: Record<string, string> = {
  blue: 'hover:bg-blue-500/10 hover:border-blue-500/30',
  purple: 'hover:bg-purple-500/10 hover:border-purple-500/30',
  green: 'hover:bg-green-500/10 hover:border-green-500/30',
  orange: 'hover:bg-orange-500/10 hover:border-orange-500/30',
  teal: 'hover:bg-teal-500/10 hover:border-teal-500/30',
  pink: 'hover:bg-pink-500/10 hover:border-pink-500/30',
};

export const QuickActionsGrid = ({ department, onActionClick }: QuickActionsGridProps) => {
  const hoverClass = colorHoverClasses[department.color] || colorHoverClasses.blue;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
      {department.quickActions.map((action, index) => (
        <Button
          key={index}
          variant="outline"
          onClick={() => onActionClick(action)}
          className={cn(
            'h-auto py-4 px-3 flex flex-col items-center gap-2 min-h-[80px]',
            hoverClass
          )}
        >
          <span className="text-xl flex-shrink-0">{action.icon}</span>
          <span className="text-sm text-center leading-tight break-words">{action.title}</span>
        </Button>
      ))}
    </div>
  );
};
