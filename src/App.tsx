import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AudioProvider } from "@/context/AudioContext";
import { MiniPlayer } from "@/components/MiniPlayer";
import Index from "./pages/Index";
import AudioPlaylists from "./pages/AudioPlaylists";
import AudioList from "./pages/AudioList";
import AudioPlayer from "./pages/AudioPlayer";
import BookList from "./pages/BookList";
import BookViewer from "./pages/BookViewer";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AudioProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="max-w-lg mx-auto min-h-screen bg-background">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/audio" element={<AudioPlaylists />} />
              <Route path="/audio/:playlistId" element={<AudioList />} />
              <Route path="/audio/player" element={<AudioPlayer />} />
              <Route path="/books" element={<BookList />} />
              <Route path="/books/:bookId" element={<BookViewer />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <MiniPlayer />
          </div>
        </BrowserRouter>
      </AudioProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
