import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface BackButtonProps {
  to: string;
}

export function BackButton({ to }: BackButtonProps) {
  return (
    <Link 
      to={to} 
      className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-card shadow-md border border-border text-foreground transition-all duration-200 active:scale-95 hover:bg-muted"
      aria-label="Kembali"
    >
      <ArrowLeft className="w-5 h-5" />
    </Link>
  );
}