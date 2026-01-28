import { BackButton } from "@/components/BackButton";
import { ListCard } from "@/components/ListCard";
import { useData } from "@/context/DataContext";
import { Loader2 } from "lucide-react";

export default function BookList() {
  const { books, isLoadingBooks } = useData();

  if (isLoadingBooks) {
    return (
      <div className="page-container flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Memuat daftar buku...</p>
        </div>
      </div>
    );
  }

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
          <ListCard
            key={book.id}
            title={book.title}
            description={book.description}
            to={`/books/${book.id}`}
            buttonText="Buka Buku"
          />
        ))}

        {books.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>Belum ada buku tersedia</p>
          </div>
        )}
      </div>
    </div>
  );
}
