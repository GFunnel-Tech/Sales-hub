import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  value: number;
  onChange: (value: number) => void;
  max?: number;
  size?: "sm" | "md" | "lg";
}

export function StarRating({ value, onChange, max = 5, size = "md" }: StarRatingProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  return (
    <div className="flex gap-1">
      {Array.from({ length: max }, (_, i) => i + 1).map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className={cn(
            "transition-colors hover:scale-110 transform",
            star <= value
              ? "text-yellow-500"
              : "text-muted-foreground/30 hover:text-yellow-400"
          )}
        >
          <Star
            className={cn(sizeClasses[size], star <= value && "fill-current")}
          />
        </button>
      ))}
    </div>
  );
}
