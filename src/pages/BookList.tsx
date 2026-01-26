import { BackButton } from "@/components/BackButton";
import { ListCard } from "@/components/ListCard";
import { books } from "@/data/books";

export default function BookList() {
  return (
    <div className="page-container">
      <BackButton to="/" />
      
      <header className="mb-4 mt-2">
        <h1 className="page-title">Buku Panduan</h1>
        <p className="page-subtitle mt-1">
          Pilih buku yang ingin dibaca
        </p>
      </header>

      <div className="flex flex-col gap-2">
        {books.map((book) => (
          <ListCard
            key={book.id}
            title={book.title}
            description={book.description}
            to={`/books/${book.id}`}
            buttonText="Buka"
          />
        ))}
      </div>
    </div>
  );
}
