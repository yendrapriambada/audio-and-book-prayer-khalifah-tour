import { useParams } from "react-router-dom";
import { Play, Pause } from "lucide-react";
import { BackButton } from "@/components/BackButton";
import { getPlaylist } from "@/data/playlists";
import { useAudio } from "@/context/AudioContext";
import { Button } from "@/components/ui/button";

export default function AudioList() {
  const { playlistId } = useParams<{ playlistId: string }>();
  const playlist = getPlaylist(playlistId || "");
  const { currentTrack, isPlaying, play, pause, resume } = useAudio();

  if (!playlist) {
    return (
      <div className="page-container">
        <BackButton to="/audio" />
        <p className="text-center text-xl mt-10">Playlist tidak ditemukan</p>
      </div>
    );
  }

  const handlePlayPause = (track: { id: string; title: string; src: string }) => {
    const audioTrack = {
      ...track,
      playlistId: playlist.id,
      playlistTitle: playlist.title,
    };

    if (currentTrack?.id === track.id) {
      if (isPlaying) {
        pause();
      } else {
        resume();
      }
    } else {
      play(audioTrack);
    }
  };

  return (
    <div className="page-container">
      <BackButton to="/audio" />
      
      <header className="mb-8 mt-4">
        <h1 className="page-title">{playlist.title}</h1>
        <p className="page-subtitle mt-2">{playlist.description}</p>
      </header>

      <div className="flex flex-col gap-4">
        {playlist.tracks.map((track) => {
          const isCurrentTrack = currentTrack?.id === track.id;
          const isThisPlaying = isCurrentTrack && isPlaying;

          return (
            <div
              key={track.id}
              className={`list-item-card flex items-center gap-4 ${
                isCurrentTrack ? "ring-2 ring-primary" : ""
              }`}
            >
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-semibold text-foreground truncate">
                  {track.title}
                </h3>
                {isCurrentTrack && (
                  <p className="text-primary font-medium mt-1">
                    {isThisPlaying ? "Sedang Diputar" : "Dijeda"}
                  </p>
                )}
              </div>

              <Button
                variant={isThisPlaying ? "secondary" : "default"}
                size="icon-lg"
                onClick={() => handlePlayPause(track)}
                aria-label={isThisPlaying ? "Jeda" : "Putar"}
              >
                {isThisPlaying ? (
                  <Pause className="w-8 h-8" fill="currentColor" />
                ) : (
                  <Play className="w-8 h-8 ml-1" fill="currentColor" />
                )}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
