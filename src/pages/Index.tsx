import { Headphones, BookOpen } from "lucide-react";
import { ActionCard } from "@/components/ActionCard";

const Index = () => {
  return (
    <div className="page-container flex flex-col">
      {/* Header */}
      <header className="text-center mb-10 pt-4">
        <div className="inline-block bg-primary/10 text-primary font-semibold px-4 py-2 rounded-full text-sm mb-4">
          Khalifah Tour
        </div>
        <h1 className="text-hero font-bold text-foreground leading-tight mb-3">
          Bacaan Doa & Audio Pendamping Ibadah
        </h1>
        <p className="page-subtitle">
          Disediakan oleh Khalifah Tour untuk jamaah Haji & Umrah
        </p>
      </header>

      {/* Main Actions */}
      <div className="flex-1 flex flex-col gap-6">
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
      <footer className="text-center mt-10 pb-4">
        <p className="text-muted-foreground text-base">
          Semoga ibadah Anda diterima Allah SWT
        </p>
      </footer>
    </div>
  );
};

export default Index;
