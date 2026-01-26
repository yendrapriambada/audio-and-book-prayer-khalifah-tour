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
  const gradientClass = variant === "primary" 
    ? "bg-gradient-to-br from-[hsl(168,80%,38%)] to-[hsl(180,70%,45%)]" 
    : "bg-gradient-to-br from-[hsl(24,95%,55%)] to-[hsl(35,95%,60%)]";

  return (
    <Link
      to={to}
      className={`${gradientClass} text-white rounded-2xl p-6 shadow-lg transition-all duration-150 active:scale-[0.98] block flex-1`}
    >
      <div className="flex flex-col items-center text-center gap-3 py-4">
        <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
          <Icon className="w-8 h-8" strokeWidth={1.5} />
        </div>
        <div>
          <h2 className="text-xl font-semibold">{title}</h2>
          {description && (
            <p className="text-sm opacity-90 mt-1">{description}</p>
          )}
        </div>
      </div>
    </Link>
  );
}
