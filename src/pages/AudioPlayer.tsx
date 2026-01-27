import { Play, Pause } from "lucide-react";
import { BackButton } from "@/components/BackButton";
import { useAudio } from "@/context/AudioContext";
import { Button } from "@/components/ui/button";

export default function AudioPlayer() {
  const { currentTrack, isPlaying, pause, resume } = useAudio();

  if (!currentTrack) {
    return (
      <div className="page-container">
        <BackButton to="/audio" />
        <div className="flex-1 flex items-center justify-center mt-20">
          <p className="text-xl text-muted-foreground text-center">
            Tidak ada audio yang dipilih.
            <br />
            Silakan pilih audio dari playlist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container flex flex-col min-h-screen">
      <BackButton to={`/audio/${currentTrack.playlistId}`} />

      <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
        {/* Album Art Placeholder */}
        <div className="w-48 h-48 bg-primary/10 rounded-3xl flex items-center justify-center mb-8">
          <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center">
            {isPlaying ? (
              <div className="flex gap-1">
                <div className="w-1.5 h-8 bg-primary-foreground rounded-full animate-pulse-soft" />
                <div className="w-1.5 h-6 bg-primary-foreground rounded-full animate-pulse-soft delay-75" />
                <div className="w-1.5 h-10 bg-primary-foreground rounded-full animate-pulse-soft delay-150" />
                <div className="w-1.5 h-5 bg-primary-foreground rounded-full animate-pulse-soft delay-200" />
              </div>
            ) : (
              <Play className="w-10 h-10 text-primary-foreground ml-1" fill="currentColor" />
            )}
          </div>
        </div>

        {/* Track Info */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            {currentTrack.title}
          </h1>
          <p className="text-lg text-muted-foreground">
            {currentTrack.playlistTitle}
          </p>
        </div>

        {/* Status */}
        <div className="mb-10">
          <span className={`inline-block px-6 py-3 rounded-full text-lg font-semibold ${
            isPlaying 
              ? "bg-primary text-primary-foreground" 
              : "bg-muted text-muted-foreground"
          }`}>
            {isPlaying ? "Sedang Diputar" : "Dijeda"}
          </span>
        </div>

        {/* Play/Pause Button */}
        <Button
          variant={isPlaying ? "secondary" : "default"}
          size="xl"
          onClick={isPlaying ? pause : resume}
          className="w-full max-w-xs"
        >
          {isPlaying ? (
            <>
              <Pause className="w-8 h-8" fill="currentColor" />
              Jeda
            </>
          ) : (
            <>
              <Play className="w-8 h-8 ml-1" fill="currentColor" />
              Putar
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
