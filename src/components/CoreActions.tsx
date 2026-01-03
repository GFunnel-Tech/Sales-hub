import { Button } from '@/components/ui/button';
import { CoreAction, DepartmentConfig } from '@/lib/departmentConfigs';

interface CoreActionsProps {
  department: DepartmentConfig;
  onActionClick: (action: CoreAction) => void;
}

export const CoreActions = ({ department, onActionClick }: CoreActionsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {department.coreActions.map((action, index) => (
        <Button
          key={index}
          onClick={() => onActionClick(action)}
          className="h-auto py-6 px-6 flex flex-col items-center gap-3 bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <span className="text-2xl">{action.icon}</span>
          <span className="font-semibold text-base">{action.title}</span>
          <span className="text-xs opacity-80 text-center">{action.description}</span>
        </Button>
      ))}
    </div>
  );
};
