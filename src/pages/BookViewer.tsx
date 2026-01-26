import { useParams } from "react-router-dom";
import { Download, ZoomIn, ZoomOut } from "lucide-react";
import { useState } from "react";
import { BackButton } from "@/components/BackButton";
import { getBook } from "@/data/books";
import { Button } from "@/components/ui/button";

export default function BookViewer() {
  const { bookId } = useParams<{ bookId: string }>();
  const book = getBook(bookId || "");
  const [zoom, setZoom] = useState(100);

  if (!book) {
    return (
      <div className="page-container">
        <BackButton to="/books" />
        <p className="text-center text-xl mt-10">Buku tidak ditemukan</p>
      </div>
    );
  }

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 25, 50));
  };

  const handleDownload = () => {
    window.open(book.pdfUrl, "_blank");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="sticky top-0 bg-background z-10 px-4 py-3 border-b border-border">
        <BackButton to="/books" />
        <h1 className="text-xl font-bold text-foreground mt-2 truncate">
          {book.title}
        </h1>
      </div>

      {/* PDF Viewer */}
      <div className="flex-1 overflow-auto p-4">
        <div 
          className="bg-card rounded-xl shadow-md overflow-hidden"
          style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top left" }}
        >
          <iframe
            src={`${book.pdfUrl}#toolbar=0`}
            className="w-full min-h-[600px]"
            title={book.title}
            style={{ 
              width: zoom !== 100 ? `${10000 / zoom}%` : "100%",
            }}
          />
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="sticky bottom-0 bg-background border-t border-border p-4 pb-safe-bottom">
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="default"
            onClick={handleZoomOut}
            disabled={zoom <= 50}
            className="flex-1"
          >
            <ZoomOut className="w-5 h-5" />
            Kecilkan
          </Button>
          
          <Button
            variant="outline"
            size="default"
            onClick={handleZoomIn}
            disabled={zoom >= 200}
            className="flex-1"
          >
            <ZoomIn className="w-5 h-5" />
            Besarkan
          </Button>
        </div>
        
        <Button
          variant="default"
          size="lg"
          onClick={handleDownload}
          className="w-full mt-3"
        >
          <Download className="w-5 h-5" />
          Download PDF
        </Button>
      </div>
    </div>
  );
}
