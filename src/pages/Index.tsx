import { Headphones, BookOpen } from "lucide-react";
import { ActionCard } from "@/components/ActionCard";

const Index = () => {
  return (
    <div className="page-container flex flex-col min-h-screen">
      {/* Header */}
      <header className="text-center mb-8 pt-6">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary font-medium px-3 py-1.5 rounded-full text-xs mb-4">
          <div className="w-5 h-5 bg-primary rounded-md flex items-center justify-center">
            <span className="text-primary-foreground text-[10px] font-bold">KT</span>
          </div>
          Khalifah Tour
        </div>
        <h1 className="text-xl font-bold text-foreground leading-snug mb-2">
          Bacaan Doa & Audio<br />Pendamping Ibadah
        </h1>
        <p className="text-sm text-muted-foreground">
          Untuk jamaah Haji & Umrah
        </p>
      </header>

      {/* Main Actions - 2 Big Cards */}
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
      <footer className="text-center pt-6 pb-4">
        <p className="text-xs text-muted-foreground">
          Semoga ibadah Anda diterima Allah SWT
        </p>
      </footer>
    </div>
  );
};

export default Index;
