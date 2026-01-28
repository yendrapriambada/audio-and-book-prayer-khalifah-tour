import React from 'react';
import { BackButton } from '@/components/BackButton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AudioManager } from '@/components/admin/AudioManager';
import { BookManager } from '@/components/admin/BookManager';
import { AdminGate } from '@/components/AdminGate';

const Admin = () => {
  return (
    <AdminGate>
      <div className="page-container">
        <BackButton to="/" />

        <div className="mt-4 mb-6">
          <h1 className="page-title">Admin Panel</h1>
          <p className="page-subtitle">Kelola konten audio dan buku</p>
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
    </AdminGate>
  );
};

export default Admin;
