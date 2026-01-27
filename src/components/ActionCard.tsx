import { LucideIcon } from "lucide-react";
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
    : "bg-secondary";
  
  const textClass = variant === "primary"
    ? "text-primary-foreground"
    : "text-secondary-foreground";

  return (
    <Link
      to={to}
      className={`${bgClass} ${textClass} rounded-2xl p-6 shadow-lg transition-all duration-200 active:scale-[0.98] block`}
    >
      <div className="flex flex-col items-center text-center gap-3">
        <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center">
          <Icon className="w-7 h-7" strokeWidth={2} />
        </div>
        <div>
          <h2 className="text-lg font-bold mb-0.5">{title}</h2>
          {description && (
            <p className="text-sm opacity-90">{description}</p>
          )}
        </div>
      </div>
    </Link>
  );
}
