export interface Book {
  id: string;
  title: string;
  description: string;
  pdfUrl: string;
  pageCount?: number;
}

// Sample PDF URL - in production, replace with actual PDF files
const SAMPLE_PDF = "https://www.w3.org/WAI/WCAG21/Techniques/pdf/img/table-word.pdf";

export const books: Book[] = [
  {
    id: "panduan-haji",
    title: "Panduan Ibadah Haji",
    description: "Panduan lengkap tata cara ibadah Haji",
    pdfUrl: SAMPLE_PDF,
    pageCount: 45,
  },
  {
    id: "panduan-umrah",
    title: "Panduan Ibadah Umrah",
    description: "Panduan lengkap tata cara ibadah Umrah",
    pdfUrl: SAMPLE_PDF,
    pageCount: 32,
  },
  {
    id: "kumpulan-doa",
    title: "Kumpulan Doa Haji & Umrah",
    description: "Buku doa lengkap untuk jamaah",
    pdfUrl: SAMPLE_PDF,
    pageCount: 68,
  },
  {
    id: "dzikir-pagi-petang",
    title: "Dzikir Pagi dan Petang",
    description: "Bacaan dzikir harian",
    pdfUrl: SAMPLE_PDF,
    pageCount: 24,
  },
  {
    id: "adab-jamaah",
    title: "Adab Jamaah Haji & Umrah",
    description: "Tata krama selama di Tanah Suci",
    pdfUrl: SAMPLE_PDF,
    pageCount: 28,
  },
];

export function getBook(id: string): Book | undefined {
  return books.find((b) => b.id === id);
}
