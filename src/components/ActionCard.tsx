import { LucideIcon, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

interface ActionCardProps {
  title: string;
  description?: string;
  icon: LucideIcon;
  to: string;
  variant?: "primary" | "secondary";
}

export function ActionCard({ 
  title, 
  description, 
  icon: Icon, 
  to, 
  variant = "primary" 
}: ActionCardProps) {
  const bgClass = variant === "primary" 
    ? "bg-primary" 
    : "bg-primary";

  return (
    <Link
      to={to}
      className={`${bgClass} text-primary-foreground rounded-xl p-4 transition-all duration-150 active:scale-[0.99] block`}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5" strokeWidth={2} />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-base font-semibold">{title}</h2>
          {description && (
            <p className="text-xs opacity-80">{description}</p>
          )}
        </div>
        <ChevronRight className="w-5 h-5 opacity-60 flex-shrink-0" />
      </div>
    </Link>
  );
}
