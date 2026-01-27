import { useParams } from "react-router-dom";
import { Download, ZoomIn, ZoomOut } from "lucide-react";
import { useState } from "react";
import { BackButton } from "@/components/BackButton";
import { useData } from "@/context/DataContext";
import { Button } from "@/components/ui/button";

export default function BookViewer() {
  const { bookId } = useParams<{ bookId: string }>();
  const { getBook } = useData();
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
      <div className="sticky top-0 bg-background z-10 px-4 py-2 border-b border-border">
        <BackButton to="/books" />
        <h1 className="text-base font-semibold text-foreground mt-1 truncate">
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
      <div className="sticky bottom-0 bg-background border-t border-border p-3 pb-safe-bottom">
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
    </div>
  );
}
