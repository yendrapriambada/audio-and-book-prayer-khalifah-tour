import { Headphones, BookOpen } from "lucide-react";
import { ActionCard } from "@/components/ActionCard";

const Index = () => {
  return (
    <div className="page-container flex flex-col">
      {/* Header */}
      <header className="mb-6 pt-2">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground text-xs font-bold">KT</span>
          </div>
          <span className="text-sm font-medium text-foreground">Khalifah Tour</span>
        </div>
        <h1 className="text-lg font-semibold text-foreground leading-snug mb-1">
          Bacaan Doa & Audio Pendamping Ibadah
        </h1>
        <p className="text-sm text-muted-foreground">
          Untuk jamaah Haji & Umrah
        </p>
      </header>

      {/* Main Actions */}
      <div className="flex flex-col gap-3">
        <ActionCard
          title="Audio"
          description="Dengarkan doa dan bacaan"
          icon={Headphones}
          to="/audio"
          variant="primary"
        />
        
        <ActionCard
          title="Buku"
          description="Baca panduan ibadah"
          icon={BookOpen}
          to="/books"
          variant="secondary"
        />
      </div>

      {/* Footer */}
      <footer className="text-center mt-auto pt-8 pb-4">
        <p className="text-xs text-muted-foreground">
          Semoga ibadah Anda diterima Allah SWT
        </p>
      </footer>
    </div>
  );
};

export default Index;
