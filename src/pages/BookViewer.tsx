import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Download, Loader2 } from "lucide-react";
import { useData } from "@/context/DataContext";
import { useState, useEffect } from "react";

export default function BookViewer() {
  const { bookId } = useParams<{ bookId: string }>();
  const { getBook, isLoadingBooks } = useData();
  const navigate = useNavigate();
  const book = getBook(bookId || "");
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [useGoogleViewer, setUseGoogleViewer] = useState(false);

  // Detect iOS Safari for alternative viewer
  useEffect(() => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    if (isIOS || isSafari) {
      setUseGoogleViewer(true);
    }
  }, []);

  const handleDownload = async () => {
    if (!book || isDownloading) return;
    
    setIsDownloading(true);
    try {
      const response = await fetch(book.pdf_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${book.title}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      // Fallback: open in new tab
      window.open(book.pdf_url, '_blank');
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoadingBooks) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Memuat buku...</p>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-center text-xl text-foreground">Buku tidak ditemukan</p>
      </div>
    );
  }

  // Google Docs Viewer URL for better cross-browser compatibility
  const googleViewerUrl = `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(book.pdf_url)}`;
  
  // Native PDF URL with parameters to hide toolbar
  const nativePdfUrl = `${book.pdf_url}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`;

  return (
    <div className="fixed inset-0 bg-background flex flex-col">
      {/* Floating Back Button */}
      <button
        onClick={() => navigate("/books")}
        className="absolute top-4 left-4 z-10 bg-background/80 backdrop-blur-sm rounded-full p-2 shadow-md border border-border"
        aria-label="Kembali"
      >
        <ArrowLeft className="w-5 h-5 text-foreground" />
      </button>

      {/* Floating Download Button */}
      <button
        onClick={handleDownload}
        disabled={isDownloading}
        className="absolute top-4 right-4 z-10 bg-background/80 backdrop-blur-sm rounded-full p-2 shadow-md border border-border disabled:opacity-70"
        aria-label={isDownloading ? "Mengunduh..." : "Download"}
      >
        {isDownloading ? (
          <Loader2 className="w-5 h-5 text-foreground animate-spin" />
        ) : (
          <Download className="w-5 h-5 text-foreground" />
        )}
      </button>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-5 bg-background flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Memuat PDF...</p>
          </div>
        </div>
      )}

      {/* PDF Viewer - Use Google Docs viewer for iOS/Safari, native for others */}
      <iframe
        src={useGoogleViewer ? googleViewerUrl : nativePdfUrl}
        className="flex-1 w-full border-0"
        title={book.title}
        onLoad={() => setIsLoading(false)}
        style={{ 
          minHeight: '100%',
          WebkitOverflowScrolling: 'touch',
          overflow: 'auto'
        }}
        allow="fullscreen"
      />
    </div>
  );
}
