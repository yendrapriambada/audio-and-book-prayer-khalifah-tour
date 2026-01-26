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
        <div className="flex-1 flex items-center justify-center mt-16">
          <p className="text-sm text-muted-foreground text-center">
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
        <div className="w-32 h-32 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
          <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center">
            {isPlaying ? (
              <div className="flex gap-0.5">
                <div className="w-1 h-5 bg-primary-foreground rounded-full animate-pulse-soft" />
                <div className="w-1 h-4 bg-primary-foreground rounded-full animate-pulse-soft delay-75" />
                <div className="w-1 h-6 bg-primary-foreground rounded-full animate-pulse-soft delay-150" />
                <div className="w-1 h-3 bg-primary-foreground rounded-full animate-pulse-soft delay-200" />
              </div>
            ) : (
              <Play className="w-6 h-6 text-primary-foreground ml-0.5" fill="currentColor" />
            )}
          </div>
        </div>

        {/* Track Info */}
        <div className="mb-4">
          <h1 className="text-base font-semibold text-foreground mb-1">
            {currentTrack.title}
          </h1>
          <p className="text-sm text-muted-foreground">
            {currentTrack.playlistTitle}
          </p>
        </div>

        {/* Status */}
        <div className="mb-6">
          <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-medium ${
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
          size="lg"
          onClick={isPlaying ? pause : resume}
          className="w-full max-w-[200px]"
        >
          {isPlaying ? (
            <>
              <Pause className="w-5 h-5" fill="currentColor" />
              Jeda
            </>
          ) : (
            <>
              <Play className="w-5 h-5 ml-0.5" fill="currentColor" />
              Putar
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
