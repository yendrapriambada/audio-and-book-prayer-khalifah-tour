import { Headphones, BookOpen } from "lucide-react";
import { ActionCard } from "@/components/ActionCard";
import khalifahLogo from "@/assets/khalifah-logo.png";

const Index = () => {
  return (
    <div className="page-container flex flex-col">
      {/* Header */}
      <header className="text-center mb-6 pt-4">
        <img src={khalifahLogo} alt="Khalifah Tour" className="h-16 mx-auto mb-4" />
        <h1 className="text-xl font-bold text-primary leading-tight mb-2">Ahlan Wa Sahlan! 👋</h1>
        <p className="text-sm text-muted-foreground">
          Audio & Prayer Book for Pilgrims —{" "}
          <em>Panduan ibadah yang mudah, jelas, dan bermakna untuk jamaah tercinta.</em>
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

        <ActionCard title="Buku" description="Baca panduan ibadah" icon={BookOpen} to="/books" variant="secondary" />
      </div>

      {/* Footer */}
      <footer className="text-center mt-6 pb-2">
        <p className="text-muted-foreground text-xs">Khalifah Tour</p>
        <p className="text-muted-foreground text-xs">
          <em>Teman perjalanan ibadah Anda</em>
        </p>
      </footer>
    </div>
  );
};

export default Index;
