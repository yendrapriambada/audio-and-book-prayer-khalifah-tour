import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

interface ListCardProps {
  title: string;
  description?: string;
  to: string;
  buttonText: string;
}

export function ListCard({ title, description, to, buttonText }: ListCardProps) {
  return (
    <div className="list-item-card">
      <h3 className="text-base font-semibold text-foreground mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground mb-3">{description}</p>
      )}
      <Link to={to}>
        <Button variant="default" size="default" className="w-full">
          {buttonText}
          <ChevronRight className="w-4 h-4" />
        </Button>
      </Link>
    </div>
  );
}
