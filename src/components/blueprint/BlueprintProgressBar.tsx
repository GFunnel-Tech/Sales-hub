import { useNavigate } from "react-router-dom";
import { BLUEPRINT_PAGES } from "@/lib/blueprintConfig";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface BlueprintProgressBarProps {
  currentPage: number;
}

export function BlueprintProgressBar({ currentPage }: BlueprintProgressBarProps) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between w-full max-w-4xl mx-auto">
      {BLUEPRINT_PAGES.map((page, index) => {
        const isCompleted = page.id < currentPage;
        const isCurrent = page.id === currentPage;
        const isUpcoming = page.id > currentPage;

        return (
          <div key={page.id} className="flex items-center flex-1">
            {/* Step Circle - clickable to jump phases */}
            <button
              type="button"
              onClick={() => navigate(page.path)}
              className="flex flex-col items-center group focus:outline-none"
              aria-label={`Jump to ${page.name}`}
              title={`Jump to ${page.name}`}
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all cursor-pointer group-hover:scale-110 group-hover:ring-2 group-hover:ring-primary/40",
                  isCompleted && "bg-primary text-primary-foreground",
                  isCurrent && "bg-primary text-primary-foreground ring-4 ring-primary/20",
                  isUpcoming && "bg-muted text-muted-foreground"
                )}
              >
                {isCompleted ? <Check className="h-4 w-4" /> : page.id}
              </div>
              <span
                className={cn(
                  "text-xs mt-1 hidden md:block whitespace-nowrap",
                  isCurrent ? "text-foreground font-medium" : "text-muted-foreground group-hover:text-foreground"
                )}
              >
                {page.name}
              </span>
            </button>

            {/* Connector Line */}
            {index < BLUEPRINT_PAGES.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-0.5 mx-2",
                  isCompleted ? "bg-primary" : "bg-muted"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
