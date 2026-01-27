import { useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useData } from "@/context/DataContext";

export default function BookViewer() {
  const { bookId } = useParams<{ bookId: string }>();
  const { getBook } = useData();
  const navigate = useNavigate();
  const book = getBook(bookId || "");

  if (!book) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-center text-xl text-foreground">Buku tidak ditemukan</p>
      </div>
    );
  }

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

      {/* Fullscreen PDF Embed */}
      <iframe
        src={`${book.pdf_url}#toolbar=0&navpanes=0&scrollbar=0`}
        className="flex-1 w-full border-0"
        title={book.title}
      />
    </div>
  );
}
