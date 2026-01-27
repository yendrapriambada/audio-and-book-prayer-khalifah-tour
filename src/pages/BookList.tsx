import { useState } from "react";
import { Download, X, ZoomIn, ZoomOut } from "lucide-react";
import { BackButton } from "@/components/BackButton";
import { useData } from "@/context/DataContext";
import { Button } from "@/components/ui/button";
import { Book } from "@/data/books";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

export default function BookList() {
  const { books } = useData();
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [zoom, setZoom] = useState(100);

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 25, 50));
  };

  const handleDownload = () => {
    if (selectedBook) {
      window.open(selectedBook.pdfUrl, "_blank");
    }
  };

  const handleOpenBook = (book: Book) => {
    setZoom(100);
    setSelectedBook(book);
  };

  const handleCloseBook = () => {
    setSelectedBook(null);
  };

  return (
    <div className="page-container">
      <BackButton to="/" />
      
      <header className="mb-4 mt-2">
        <h1 className="page-title">Pilih Buku</h1>
        <p className="page-subtitle mt-1">
          Pilih buku panduan yang ingin dibaca
        </p>
      </header>

      <div className="flex flex-col gap-3">
        {books.map((book) => (
          <div
            key={book.id}
            className="bg-card rounded-xl p-4 shadow-sm border border-border"
          >
            <h3 className="font-semibold text-foreground">{book.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{book.description}</p>
            <Button
              className="w-full mt-3"
              onClick={() => handleOpenBook(book)}
            >
              Buka Buku
            </Button>
          </div>
        ))}
      </div>

      {/* Full-screen PDF Dialog */}
      <Dialog open={!!selectedBook} onOpenChange={(open) => !open && handleCloseBook()}>
        <DialogContent className="max-w-none w-screen h-screen p-0 m-0 rounded-none border-none flex flex-col">
          <DialogTitle className="sr-only">
            {selectedBook?.title || "Buku"}
          </DialogTitle>
          
          {/* Header */}
          <div className="bg-background border-b border-border px-4 py-3 flex items-center justify-between shrink-0">
            <h2 className="text-base font-semibold text-foreground truncate pr-4">
              {selectedBook?.title}
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCloseBook}
              className="shrink-0"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* PDF Viewer */}
          <div className="flex-1 overflow-auto p-4 bg-muted/30">
            <div 
              className="bg-card rounded-xl shadow-md overflow-hidden"
              style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top left" }}
            >
              <iframe
                src={`${selectedBook?.pdfUrl}#toolbar=0`}
                className="w-full min-h-[600px]"
                title={selectedBook?.title}
                style={{ 
                  width: zoom !== 100 ? `${10000 / zoom}%` : "100%",
                }}
              />
            </div>
          </div>

          {/* Bottom Controls */}
          <div className="bg-background border-t border-border p-3 pb-safe-bottom shrink-0">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleZoomOut}
                disabled={zoom <= 50}
                className="flex-1"
              >
                <ZoomOut className="w-4 h-4" />
                Kecilkan
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleZoomIn}
                disabled={zoom >= 200}
                className="flex-1"
              >
                <ZoomIn className="w-4 h-4" />
                Besarkan
              </Button>
            </div>
            
            <Button
              variant="default"
              size="default"
              onClick={handleDownload}
              className="w-full mt-2"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
