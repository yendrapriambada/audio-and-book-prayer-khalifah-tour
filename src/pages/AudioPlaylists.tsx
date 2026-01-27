import { BackButton } from "@/components/BackButton";
import { ListCard } from "@/components/ListCard";
import { playlists } from "@/data/playlists";

export default function AudioPlaylists() {
  return (
    <div className="page-container">
      <BackButton to="/" />
      
      <header className="mb-4 mt-2">
        <h1 className="page-title">Pilih Playlist Audio</h1>
        <p className="page-subtitle mt-1">
          Pilih kategori doa yang ingin didengarkan
        </p>
      </header>

      <div className="flex flex-col gap-3">
        {playlists.map((playlist) => (
          <ListCard
            key={playlist.id}
            title={playlist.title}
            description={playlist.description}
            to={`/audio/${playlist.id}`}
            buttonText="Buka Playlist"
          />
        ))}
      </div>
    </div>
  );
}
