

# Rencana: Tambah Status Aktif/Nonaktif pada Playlist

## Ringkasan

Menambahkan kolom `isActive` (boolean) pada data playlist untuk mengontrol visibilitas playlist di halaman user. Playlist yang nonaktif tetap bisa dikelola di Admin Panel tetapi tidak akan muncul di halaman user.

## Perubahan yang Akan Dilakukan

### 1. Update Interface Playlist

Menambahkan properti `isActive` pada interface `Playlist`:

```typescript
// src/data/playlists.ts
export interface Playlist {
  id: string;
  title: string;
  description: string;
  tracks: AudioTrack[];
  isActive: boolean;  // Tambahan baru
}
```

### 2. Update Data Default

Semua playlist default akan memiliki `isActive: true`:

```typescript
export const playlists: Playlist[] = [
  {
    id: "doa-manasik",
    title: "Doa Manasik",
    description: "Kumpulan doa untuk persiapan manasik",
    isActive: true,  // Aktif secara default
    tracks: [...]
  },
  // ...
];
```

### 3. Update Admin - AudioManager

Menambahkan toggle switch untuk mengaktifkan/menonaktifkan playlist:

- Menampilkan indikator status (badge "Aktif" / "Nonaktif")
- Toggle switch untuk mengubah status langsung dari daftar playlist
- Warna card berbeda untuk playlist nonaktif (lebih redup)

### 4. Update Admin - PlaylistForm

Menambahkan switch pada form untuk mengatur status saat membuat/edit playlist:

- Switch "Status Aktif" dengan label jelas
- Default aktif untuk playlist baru

### 5. Update Halaman User (AudioPlaylists)

Filter playlist yang ditampilkan hanya yang aktif:

```typescript
// src/pages/AudioPlaylists.tsx
const { playlists } = useData();
const activePlaylists = playlists.filter(p => p.isActive);

// Tampilkan activePlaylists
```

### 6. Update DataContext

Menambahkan fungsi toggle status dan memastikan `isActive` disertakan saat membuat playlist baru.

---

## Detail Teknis

### File yang Dimodifikasi

| File | Perubahan |
|------|-----------|
| `src/data/playlists.ts` | Tambah `isActive` ke interface dan data default |
| `src/context/DataContext.tsx` | Update `addPlaylist` untuk include `isActive`, tambah fungsi `togglePlaylistStatus` |
| `src/components/admin/PlaylistForm.tsx` | Tambah Switch untuk status, update props dan submit handler |
| `src/components/admin/AudioManager.tsx` | Tampilkan status badge, tambah toggle switch langsung di card |
| `src/pages/AudioPlaylists.tsx` | Filter hanya playlist aktif |

### Tampilan di Admin Panel

```text
+------------------------------------------+
|  [v] Doa Manasik            [Aktif] [Edit] [Delete]
|      3 audio                 [ Toggle ]
+------------------------------------------+
|  [>] Doa Harian             [Nonaktif] [Edit] [Delete]
|      6 audio   (card lebih redup)
+------------------------------------------+
```

### Komponen Switch

Menggunakan komponen `Switch` dari `@/components/ui/switch` yang sudah tersedia di project.

### Migrasi Data Lama

Playlist yang sudah tersimpan di localStorage tanpa properti `isActive` akan otomatis dianggap aktif (`isActive ?? true`) untuk backward compatibility.

