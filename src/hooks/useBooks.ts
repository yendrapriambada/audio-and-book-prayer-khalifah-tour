import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Book {
  id: string;
  title: string;
  description: string | null;
  pdf_url: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export function useBooks() {
  return useQuery({
    queryKey: ['books'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      return data as Book[];
    },
  });
}

export function useBook(id: string) {
  return useQuery({
    queryKey: ['book', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      return data as Book | null;
    },
    enabled: !!id,
  });
}

export function useBookMutations() {
  const queryClient = useQueryClient();

  const addBook = useMutation({
    mutationFn: async (book: { title: string; description?: string; pdf_url: string }) => {
      const { data: maxOrder } = await supabase
        .from('books')
        .select('sort_order')
        .order('sort_order', { ascending: false })
        .limit(1)
        .maybeSingle();

      const { data, error } = await supabase
        .from('books')
        .insert({
          title: book.title,
          description: book.description || null,
          pdf_url: book.pdf_url,
          sort_order: (maxOrder?.sort_order || 0) + 1,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });

  const updateBook = useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; title?: string; description?: string; pdf_url?: string }) => {
      const { data, error } = await supabase
        .from('books')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });

  const deleteBook = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('books')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });

  return { addBook, updateBook, deleteBook };
}
