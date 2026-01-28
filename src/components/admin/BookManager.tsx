import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Edit, Trash2, BookOpen, Loader2 } from 'lucide-react';
import { useData, Book } from '@/context/DataContext';
import { BookForm } from './BookForm';
import { deleteStorageFile } from '@/lib/storageUtils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export function BookManager() {
  const { books, isLoadingBooks, addBook, updateBook, deleteBook } = useData();
  
  const [formOpen, setFormOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleAdd = () => {
    setEditingBook(null);
    setFormOpen(true);
  };

  const handleEdit = (book: Book) => {
    setEditingBook(book);
    setFormOpen(true);
  };

  const handleSubmit = async (data: { title: string; description: string; pdf_url: string; oldPdfUrl?: string }) => {
    // Delete old file from storage if replaced
    if (data.oldPdfUrl) {
      await deleteStorageFile('books', data.oldPdfUrl);
    }
    
    if (editingBook) {
      await updateBook(editingBook.id, { title: data.title, description: data.description, pdf_url: data.pdf_url });
    } else {
      await addBook({ title: data.title, description: data.description, pdf_url: data.pdf_url });
    }
  };

  const handleDeleteConfirm = async () => {
    if (deleteConfirm) {
      setIsDeleting(true);
      try {
        // Delete PDF file from storage
        const book = books.find(b => b.id === deleteConfirm);
        if (book) {
          await deleteStorageFile('books', book.pdf_url);
        }
        await deleteBook(deleteConfirm);
      } finally {
        setIsDeleting(false);
        setDeleteConfirm(null);
      }
    }
  };

  if (isLoadingBooks) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Kelola Buku</h2>
        <Button onClick={handleAdd} size="sm">
          <Plus className="h-4 w-4 mr-1" />
          Buku Baru
        </Button>
      </div>

      <div className="space-y-3">
        {books.map((book) => (
          <Card key={book.id}>
            <CardContent className="p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0 overflow-hidden">
                  <div className="w-10 h-12 bg-primary/10 rounded flex items-center justify-center flex-shrink-0">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0 overflow-hidden">
                    <h3 className="font-medium text-foreground truncate" title={book.title}>{book.title}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-1">{book.description}</p>
                  </div>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleEdit(book)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => setDeleteConfirm(book.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {books.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <BookOpen className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Belum ada buku</p>
          </div>
        )}
      </div>

      <BookForm
        open={formOpen}
        onOpenChange={setFormOpen}
        book={editingBook}
        onSubmit={handleSubmit}
      />

      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus buku ini?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm} 
              className="bg-destructive text-destructive-foreground"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Menghapus...
                </>
              ) : (
                'Hapus'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
