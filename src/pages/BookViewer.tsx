import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Download, Loader2, FileText, ExternalLink } from "lucide-react";
import { useData } from "@/context/DataContext";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function BookViewer() {
  const { bookId } = useParams<{ bookId: string }>();
  const { getBook, isLoadingBooks } = useData();
  const navigate = useNavigate();
  const book = getBook(bookId || "");
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [useGoogleViewer, setUseGoogleViewer] = useState(false);
  const [viewerFailed, setViewerFailed] = useState(false);
  const [loadTimeout, setLoadTimeout] = useState<NodeJS.Timeout | null>(null);

  // Detect iOS Safari for alternative viewer
  useEffect(() => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    if (isIOS || isSafari) {
      setUseGoogleViewer(true);
    }
  }, []);

  // Set a timeout to detect if iframe fails to load (Google Viewer has ~25MB limit)
  useEffect(() => {
    if (useGoogleViewer && isLoading) {
      const timeout = setTimeout(() => {
        // If still loading after 15 seconds, assume it failed
        if (isLoading) {
          setViewerFailed(true);
          setIsLoading(false);
        }
      }, 15000);
      setLoadTimeout(timeout);
      return () => clearTimeout(timeout);
    }
  }, [useGoogleViewer, isLoading]);

  const handleIframeLoad = () => {
    if (loadTimeout) {
      clearTimeout(loadTimeout);
    }
    setIsLoading(false);
  };

  const handleOpenInBrowser = () => {
    if (book) {
      window.open(book.pdf_url, '_blank');
    }
  };

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
      {isLoading && !viewerFailed && (
        <div className="absolute inset-0 z-5 bg-background flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Memuat PDF...</p>
          </div>
        </div>
      )}

      {/* Fallback UI for when Google Viewer fails (large files on iOS) */}
      {viewerFailed && (
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="flex flex-col items-center gap-6 text-center max-w-sm">
            <div className="w-20 h-24 bg-primary/10 rounded-lg flex items-center justify-center">
              <FileText className="w-10 h-10 text-primary" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-foreground">
                File Terlalu Besar untuk Preview
              </h2>
              <p className="text-muted-foreground text-sm">
                File PDF ini terlalu besar untuk ditampilkan langsung di browser. 
                Silakan download atau buka di tab baru untuk membacanya.
              </p>
            </div>
            <div className="flex flex-col gap-3 w-full">
              <Button 
                onClick={handleDownload} 
                disabled={isDownloading}
                className="w-full"
                size="lg"
              >
                {isDownloading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Mengunduh...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </>
                )}
              </Button>
              <Button 
                onClick={handleOpenInBrowser} 
                variant="outline"
                className="w-full"
                size="lg"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Buka di Tab Baru
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* PDF Viewer - Use Google Docs viewer for iOS/Safari, native for others */}
      {!viewerFailed && (
        <iframe
          src={useGoogleViewer ? googleViewerUrl : nativePdfUrl}
          className="flex-1 w-full border-0"
          title={book.title}
          onLoad={handleIframeLoad}
          onError={() => setViewerFailed(true)}
          style={{ 
            minHeight: '100%',
            WebkitOverflowScrolling: 'touch',
            overflow: 'auto'
          }}
          allow="fullscreen"
        />
      )}
    </div>
  );
}
