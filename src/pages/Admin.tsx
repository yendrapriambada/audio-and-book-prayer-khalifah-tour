import React from 'react';
import { BackButton } from '@/components/BackButton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AudioManager } from '@/components/admin/AudioManager';
import { BookManager } from '@/components/admin/BookManager';
import { Button } from '@/components/ui/button';
import { useData } from '@/context/DataContext';
import { RotateCcw } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const Admin = () => {
  const { resetToDefaults } = useData();

  return (
    <div className="page-container">
      <BackButton to="/" />

      <div className="mt-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title">Admin Panel</h1>
            <p className="page-subtitle">Kelola konten audio dan buku</p>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm">
                <RotateCcw className="h-4 w-4 mr-1" />
                Reset
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Reset ke Data Awal</AlertDialogTitle>
                <AlertDialogDescription>
                  Semua perubahan yang Anda buat akan hilang dan data akan dikembalikan ke kondisi awal. Tindakan ini tidak dapat dibatalkan.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction onClick={resetToDefaults}>Reset</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <Tabs defaultValue="audio" className="w-full">
        <TabsList className="w-full grid grid-cols-2 mb-4">
          <TabsTrigger value="audio">Audio</TabsTrigger>
          <TabsTrigger value="books">Buku</TabsTrigger>
        </TabsList>
        
        <TabsContent value="audio">
          <AudioManager />
        </TabsContent>
        
        <TabsContent value="books">
          <BookManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
