import { useParams } from "react-router-dom";
import { Play, Pause } from "lucide-react";
import { BackButton } from "@/components/BackButton";
import { getPlaylist } from "@/data/playlists";
import { useAudio } from "@/context/AudioContext";
import { Button } from "@/components/ui/button";

export default function AudioList() {
  const { playlistId } = useParams<{ playlistId: string }>();
  const playlist = getPlaylist(playlistId || "");
  const { currentTrack, isPlaying, play, pause, resume, playPlaylist, playlist: currentPlaylist } = useAudio();

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

  const handlePlayAll = () => {
    // Check if we're already playing this playlist
    const isThisPlaylistPlaying = currentPlaylist.length > 0 && 
      currentPlaylist[0]?.playlistId === playlist.id;
    
    if (isThisPlaylistPlaying && isPlaying) {
      pause();
    } else if (isThisPlaylistPlaying && !isPlaying) {
      resume();
    } else {
      const tracks = playlist.tracks.map(track => ({
        ...track,
        playlistId: playlist.id,
        playlistTitle: playlist.title,
      }));
      playPlaylist(tracks, 0);
    }
  };

  const isThisPlaylistActive = currentPlaylist.length > 0 && 
    currentPlaylist[0]?.playlistId === playlist.id;

  return (
    <div className="page-container pb-32">
      <BackButton to="/audio" />
      
      <header className="mb-4 mt-2">
        <h1 className="page-title">{playlist.title}</h1>
        <p className="page-subtitle mt-1">{playlist.description}</p>
        
        {/* Play All Button */}
        <Button
          variant={isThisPlaylistActive && isPlaying ? "secondary" : "default"}
          size="lg"
          onClick={handlePlayAll}
          className="w-full mt-4"
        >
          {isThisPlaylistActive && isPlaying ? (
            <>
              <Pause className="w-5 h-5" fill="currentColor" />
              Jeda Semua
            </>
          ) : (
            <>
              <Play className="w-5 h-5 ml-0.5" fill="currentColor" />
              Putar Semua
            </>
          )}
        </Button>
      </header>

      <div className="flex flex-col gap-3">
        {playlist.tracks.map((track, index) => {
          const isCurrentTrack = currentTrack?.id === track.id;
          const isThisPlaying = isCurrentTrack && isPlaying;

          return (
            <div
              key={track.id}
              className={`list-item-card flex items-center gap-3 ${
                isCurrentTrack ? "ring-2 ring-primary" : ""
              }`}
            >
              {/* Track Number */}
              <span className="w-6 text-center text-sm text-muted-foreground font-medium">
                {index + 1}
              </span>
              
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-medium text-foreground truncate">
                  {track.title}
                </h3>
                {isCurrentTrack && (
                  <p className="text-primary text-sm font-medium mt-0.5">
                    {isThisPlaying ? "Sedang Diputar" : "Dijeda"}
                  </p>
                )}
              </div>

              <Button
                variant={isThisPlaying ? "secondary" : "default"}
                size="icon"
                onClick={() => handlePlayPause(track)}
                aria-label={isThisPlaying ? "Jeda" : "Putar"}
              >
                {isThisPlaying ? (
                  <Pause className="w-5 h-5" fill="currentColor" />
                ) : (
                  <Play className="w-5 h-5 ml-0.5" fill="currentColor" />
                )}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
