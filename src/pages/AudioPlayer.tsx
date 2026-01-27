import { Play, Pause, SkipBack, SkipForward } from "lucide-react";
import { BackButton } from "@/components/BackButton";
import { useAudio } from "@/context/AudioContext";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

function formatTime(seconds: number): string {
  if (isNaN(seconds) || !isFinite(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function AudioPlayer() {
  const { 
    currentTrack, 
    isPlaying, 
    currentTime,
    duration,
    playlist,
    currentIndex,
    pause, 
    resume,
    next,
    previous,
    seek
  } = useAudio();

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

  const hasNext = currentIndex < playlist.length - 1;
  const hasPrevious = currentIndex > 0 || currentTime > 3;
  const remainingTime = duration - currentTime;

  return (
    <div className="page-container flex flex-col min-h-screen pb-8">
      <BackButton to={`/audio/${currentTrack.playlistId}`} />

      <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
        {/* Album Art Placeholder */}
        <div className="w-64 h-64 bg-primary/10 rounded-3xl flex items-center justify-center mb-8 shadow-lg">
          <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center">
            {isPlaying ? (
              <div className="flex gap-1.5">
                <div className="w-2 h-10 bg-primary-foreground rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-8 bg-primary-foreground rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-12 bg-primary-foreground rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
                <div className="w-2 h-6 bg-primary-foreground rounded-full animate-pulse" style={{ animationDelay: '450ms' }} />
              </div>
            ) : (
              <Play className="w-12 h-12 text-primary-foreground ml-1" fill="currentColor" />
            )}
          </div>
        </div>

        {/* Track Info */}
        <div className="mb-6 w-full">
          <h1 className="text-2xl font-bold text-foreground mb-1 truncate">
            {currentTrack.title}
          </h1>
          <p className="text-lg text-muted-foreground">
            {currentTrack.playlistTitle}
          </p>
          {playlist.length > 1 && (
            <p className="text-sm text-muted-foreground mt-1">
              {currentIndex + 1} dari {playlist.length}
            </p>
          )}
        </div>

        {/* Progress Bar */}
        <div className="w-full mb-6">
          <Slider
            value={[currentTime]}
            max={duration || 100}
            step={1}
            onValueChange={(value) => seek(value[0])}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-muted-foreground mt-2">
            <span>{formatTime(currentTime)}</span>
            <span>-{formatTime(remainingTime)}</span>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center justify-center gap-4 w-full">
          {/* Previous Button */}
          <Button
            variant="ghost"
            size="icon-lg"
            onClick={previous}
            disabled={!hasPrevious}
            aria-label="Sebelumnya"
            className="text-foreground disabled:opacity-30"
          >
            <SkipBack className="w-8 h-8" fill="currentColor" />
          </Button>

          {/* Play/Pause Button */}
          <Button
            variant="default"
            size="icon-lg"
            onClick={isPlaying ? pause : resume}
            className="w-16 h-16 rounded-full"
            aria-label={isPlaying ? "Jeda" : "Putar"}
          >
            {isPlaying ? (
              <Pause className="w-8 h-8" fill="currentColor" />
            ) : (
              <Play className="w-8 h-8 ml-1" fill="currentColor" />
            )}
          </Button>

          {/* Next Button */}
          <Button
            variant="ghost"
            size="icon-lg"
            onClick={next}
            disabled={!hasNext}
            aria-label="Selanjutnya"
            className="text-foreground disabled:opacity-30"
          >
            <SkipForward className="w-8 h-8" fill="currentColor" />
          </Button>
        </div>
      </div>
    </div>
  );
}
