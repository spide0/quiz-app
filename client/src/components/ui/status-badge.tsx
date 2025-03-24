import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  color: string;
  name: string;
  description: string;
  className?: string;
}

export function StatusBadge({ color, name, description, className }: StatusBadgeProps) {
  return (
    <div className={cn("border rounded-lg p-4 flex items-center", className)}>
      <div 
        className="h-4 w-4 rounded-full mr-3" 
        style={{ backgroundColor: color }}
      />
      <div>
        <h3 className="font-medium">{name}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
  );
}
