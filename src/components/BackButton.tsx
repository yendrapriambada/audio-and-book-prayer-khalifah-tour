import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface BackButtonProps {
  to: string;
}

export function BackButton({ to }: BackButtonProps) {
  return (
    <Link to={to} className="back-button">
      <ArrowLeft className="w-5 h-5" />
      <span>Kembali</span>
    </Link>
  );
}