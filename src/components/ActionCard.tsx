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
      className={`${bgClass} ${textClass} rounded-3xl p-8 shadow-xl transition-all duration-200 active:scale-[0.98] block`}
    >
      <div className="flex flex-col items-center text-center gap-4">
        <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center">
          <Icon className="w-10 h-10" strokeWidth={2} />
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-1">{title}</h2>
          {description && (
            <p className="text-lg opacity-90">{description}</p>
          )}
        </div>
      </div>
    </Link>
  );
}
