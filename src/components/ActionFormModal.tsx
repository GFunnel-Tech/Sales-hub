import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { DepartmentConfig, Role } from '@/lib/departmentConfigs';

type FormType = 'request' | 'idea' | 'delegate' | 'hire';

interface ActionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  formType: FormType;
  department: DepartmentConfig;
  actionTitle?: string;
  selectedRole?: Role;
}

export const ActionFormModal = ({
  isOpen,
  onClose,
  formType,
  department,
  actionTitle,
  selectedRole,
}: ActionFormModalProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const DEFAULT_WEBHOOK_URL = 'https://apihub.gfunnel.com/webhook-test/e996d857-0666-4224-b63c-31ab5296b067';
  const HIRING_WEBHOOK_URL = 'https://apihub.gfunnel.com/webhook-test/4da968a1-bc07-420c-9697-762ace996e95';
  
  const WEBHOOK_URL = formType === 'hire' ? HIRING_WEBHOOK_URL : DEFAULT_WEBHOOK_URL;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    // Build payload with department and action context
    const payload = {
      // Meta information
      department: department.name,
      departmentSlug: department.slug,
      formType,
      actionTitle: actionTitle || getFormTitle(),
      submittedAt: new Date().toISOString(),
      
      // Form data
      ...data,
    };

    console.log('Submitting to webhook:', payload);

    try {
      await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'no-cors',
        body: JSON.stringify(payload),
      });

      toast({
        title: 'Submitted Successfully',
        description: `Your ${formType} has been submitted to ${department.name}.`,
      });

      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: 'Submission Error',
        description: 'There was an error submitting your request. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFormTitle = () => {
    if (selectedRole) return `Hire: ${selectedRole.title}`;
    if (actionTitle) return actionTitle;
    switch (formType) {
      case 'request':
        return 'Submit Request';
      case 'idea':
        return 'Share Idea';
      case 'delegate':
        return 'Delegate Task';
      case 'hire':
        return 'Hire for Role';
      default:
        return 'Submit';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{getFormTitle()}</DialogTitle>
          <DialogDescription>
            {department.name} • Fill out the form below
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Email field - required on all forms */}
          <div className="space-y-2">
            <Label htmlFor="email">Your Email *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@company.com"
              required
            />
            <p className="text-xs text-muted-foreground">
              Required for tracking and follow-up
            </p>
          </div>

          {formType === 'request' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="requestType">Request Type</Label>
                <Select name="requestType" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {department.quickActions.map((action, i) => (
                      <SelectItem key={i} value={action.title}>
                        {action.icon} {action.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select name="priority" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Title / Summary</Label>
                <Input id="title" name="title" placeholder="Brief summary of your request" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Detailed Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Provide details about your request"
                  rows={4}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="targetDate">Target Completion Date</Label>
                <Input id="targetDate" name="targetDate" type="date" />
              </div>
            </>
          )}

          {formType === 'idea' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="ideaTitle">Idea Title</Label>
                <Input id="ideaTitle" name="ideaTitle" placeholder="Name your idea" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="areaOfImpact">Department / Area of Impact</Label>
                <Input
                  id="areaOfImpact"
                  name="areaOfImpact"
                  defaultValue={department.name}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="problem">Problem Being Solved</Label>
                <Textarea
                  id="problem"
                  name="problem"
                  placeholder="What problem does this solve?"
                  rows={3}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="solution">Proposed Solution</Label>
                <Textarea
                  id="solution"
                  name="solution"
                  placeholder="Describe your proposed solution"
                  rows={3}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="benefits">Expected Benefits</Label>
                <Textarea
                  id="benefits"
                  name="benefits"
                  placeholder="What benefits would this bring?"
                  rows={2}
                />
              </div>
            </>
          )}

          {formType === 'delegate' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="taskTitle">Task Title</Label>
                <Input id="taskTitle" name="taskTitle" placeholder="Name the task" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="assignTo">Assign To</Label>
                <Select name="assignTo" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select team member" />
                  </SelectTrigger>
                  <SelectContent>
                    {department.roles.map((role, i) => (
                      <SelectItem key={i} value={role.title}>
                        {role.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="taskPriority">Priority</Label>
                <Select name="taskPriority" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input id="dueDate" name="dueDate" type="date" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="taskDescription">Task Description</Label>
                <Textarea
                  id="taskDescription"
                  name="taskDescription"
                  placeholder="Describe the task in detail"
                  rows={3}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deliverables">Deliverables Expected</Label>
                <Textarea
                  id="deliverables"
                  name="deliverables"
                  placeholder="What should be delivered?"
                  rows={2}
                />
              </div>
            </>
          )}

          {formType === 'hire' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="roleTitle">Role Title</Label>
                <Input
                  id="roleTitle"
                  name="roleTitle"
                  defaultValue={selectedRole?.title || ''}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input id="department" name="department" defaultValue={department.name} readOnly />
              </div>
              <div className="space-y-2">
                <Label htmlFor="jobDescription">Job Description</Label>
                <Textarea
                  id="jobDescription"
                  name="jobDescription"
                  placeholder="Describe the role responsibilities"
                  rows={4}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date Needed</Label>
                <Input id="startDate" name="startDate" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="employmentType">Employment Type</Label>
                <Select name="employmentType" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
