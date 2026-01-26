import { BackButton } from "@/components/BackButton";
import { ListCard } from "@/components/ListCard";
import { books } from "@/data/books";

export default function BookList() {
  return (
    <div className="page-container">
      <BackButton to="/" />
      
      <header className="mb-8 mt-4">
        <h1 className="page-title">Pilih Buku</h1>
        <p className="page-subtitle mt-2">
          Pilih buku panduan yang ingin dibaca
        </p>
      </header>

      <div className="flex flex-col gap-4">
        {books.map((book) => (
          <ListCard
            key={book.id}
            title={book.title}
            description={book.description}
            to={`/books/${book.id}`}
            buttonText="Buka Buku"
          />
        ))}
      </div>
    </div>
  );
}
