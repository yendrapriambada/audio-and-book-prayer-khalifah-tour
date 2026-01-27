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
      <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
      {description && (
        <p className="text-muted-foreground mb-4">{description}</p>
      )}
      <Link to={to}>
        <Button variant="default" size="default" className="w-full">
          {buttonText}
          <ChevronRight className="w-5 h-5" />
        </Button>
      </Link>
    </div>
  );
}
