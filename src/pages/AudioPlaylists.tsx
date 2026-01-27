import { BackButton } from "@/components/BackButton";
import { ListCard } from "@/components/ListCard";
import { useData } from "@/context/DataContext";

export default function AudioPlaylists() {
  const { playlists } = useData();
  const activePlaylists = playlists.filter(p => p.isActive ?? true);

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
        {activePlaylists.map((playlist) => (
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
