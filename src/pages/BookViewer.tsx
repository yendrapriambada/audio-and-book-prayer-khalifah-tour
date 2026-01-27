import { useParams } from "react-router-dom";
import { Download, ExternalLink, FileText } from "lucide-react";
import { useState } from "react";
import { BackButton } from "@/components/BackButton";
import { useData } from "@/context/DataContext";
import { Button } from "@/components/ui/button";

export default function BookViewer() {
  const { bookId } = useParams<{ bookId: string }>();
  const { getBook } = useData();
  const book = getBook(bookId || "");
  const [loadError, setLoadError] = useState(false);

  if (!book) {
    return (
      <div className="page-container">
        <BackButton to="/books" />
        <p className="text-center text-xl mt-10">Buku tidak ditemukan</p>
      </div>
    );
  }

  const handleDownload = () => {
    // Open in new tab - most reliable way to view PDFs
    window.open(book.pdfUrl, "_blank", "noopener,noreferrer");
  };

  const handleOpenInNewTab = () => {
    window.open(book.pdfUrl, "_blank", "noopener,noreferrer");
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
        {loadError ? (
          // Fallback UI when PDF fails to load
          <div className="flex flex-col items-center justify-center min-h-[400px] bg-card rounded-xl p-8 text-center">
            <FileText className="w-16 h-16 text-muted-foreground mb-4" />
            <h2 className="text-lg font-semibold mb-2">PDF tidak dapat ditampilkan</h2>
            <p className="text-muted-foreground mb-6 max-w-sm">
              Browser Anda mungkin memblokir tampilan PDF. Silakan buka di tab baru atau download file.
            </p>
            <div className="flex gap-3">
              <Button onClick={handleOpenInNewTab} variant="outline">
                <ExternalLink className="w-4 h-4 mr-2" />
                Buka di Tab Baru
              </Button>
              <Button onClick={handleDownload}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-card rounded-xl shadow-md overflow-hidden">
            <object
              data={book.pdfUrl}
              type="application/pdf"
              className="w-full min-h-[600px]"
              onError={() => setLoadError(true)}
            >
              {/* Fallback for browsers that don't support object/embed */}
              <embed
                src={book.pdfUrl}
                type="application/pdf"
                className="w-full min-h-[600px]"
                onError={() => setLoadError(true)}
              />
            </object>
          </div>
        )}
      </div>

      {/* Bottom Controls */}
      <div className="sticky bottom-0 bg-background border-t border-border p-3 pb-safe-bottom">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="default"
            onClick={handleOpenInNewTab}
            className="flex-1"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Buka di Tab Baru
          </Button>
          
          <Button
            variant="default"
            size="default"
            onClick={handleDownload}
            className="flex-1"
          >
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>
    </div>
  );
}
