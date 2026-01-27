import { Headphones, BookOpen } from "lucide-react";
import { ActionCard } from "@/components/ActionCard";

const Index = () => {
  return (
    <div className="page-container flex flex-col">
      {/* Header */}
      <header className="text-center mb-6 pt-2">
        <div className="inline-block bg-primary/10 text-primary font-medium px-3 py-1.5 rounded-full text-xs mb-3">
          Khalifah Tour
        </div>
        <h1 className="text-xl font-bold text-foreground leading-tight mb-2">
          Bacaan Doa & Audio Pendamping Ibadah
        </h1>
        <p className="text-sm text-muted-foreground">
          Disediakan oleh Khalifah Tour untuk jamaah Haji & Umrah
        </p>
      </header>

      {/* Main Actions */}
      <div className="flex-1 flex flex-col gap-4">
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
      <footer className="text-center mt-6 pb-2">
        <p className="text-muted-foreground text-xs">
          Semoga ibadah Anda diterima Allah SWT
        </p>
      </footer>
    </div>
  );
};

export default Index;
