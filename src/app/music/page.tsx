import { songs } from "@/content/music/songs";
import RingSongMap from "@/components/music/RingSongMap";

export const metadata = {
  title: "Music",
  description: "Audio archive and song collection",
};

export default function MusicPage() {
  return (
    <main className="music-surface min-h-screen flex flex-col">
      <header className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 py-4 z-10">
        <a
          href="/"
          className="text-white/30 hover:text-white/60 transition-colors text-[10px] uppercase tracking-[0.15em] debug-mono"
        >
          ← Return
        </a>
        <span className="text-white/15 text-[9px] uppercase tracking-[0.2em] debug-mono">
          {songs.length} nodes · archive
        </span>
      </header>

      <div className="flex-1 relative">
        <RingSongMap songs={songs} />
      </div>

      <footer className="absolute bottom-0 left-0 right-0 px-6 py-4 z-10">
        <p className="text-white/15 text-[8px] uppercase tracking-[0.2em] debug-mono text-center">
          Select a node to access a song
        </p>
      </footer>
    </main>
  );
}
