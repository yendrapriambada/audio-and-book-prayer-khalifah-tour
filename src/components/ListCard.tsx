import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

interface ListCardProps {
  title: string;
  description?: string;
  to: string;
  buttonText: string;
}

export function ListCard({ title, description, to, buttonText }: ListCardProps) {
  return (
    <Link to={to} className="list-item-card flex items-center gap-3 active:bg-muted/50 transition-colors">
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-foreground">{title}</h3>
        {description && (
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{description}</p>
        )}
      </div>
      <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
    </Link>
  );
}
