import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BackButtonProps {
  label?: string;
  to?: string;
}

export function BackButton({ label = "Kembali", to }: BackButtonProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="back-button"
      aria-label={label}
    >
      <ChevronLeft className="w-5 h-5" strokeWidth={2} />
      <span>{label}</span>
    </button>
  );
}
