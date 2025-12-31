import { notFound } from "next/navigation";
import Link from "next/link";
import { getSongBySlug, getAllSlugs } from "@/content/music/songs";
import AudioPlayer from "@/components/music/AudioPlayer";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const song = getSongBySlug(slug);

  if (!song) {
    return { title: "Not Found" };
  }

  return {
    title: song.title,
    description: `Listen to ${song.title}`,
  };
}

export default async function SongPage({ params }: PageProps) {
  const { slug } = await params;
  const song = getSongBySlug(slug);

  if (!song) {
    notFound();
  }

  return (
    <main className="music-surface min-h-screen flex flex-col">
      <header className="flex items-center px-6 py-4 border-b border-white/3">
        <Link
          href="/music"
          className="text-white/30 hover:text-white/60 transition-colors text-[10px] uppercase tracking-[0.15em] debug-mono flex items-center gap-2"
        >
          <span className="text-white/20">◁</span> Structure
        </Link>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-lg space-y-10">
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-3 text-white/20 text-[9px] uppercase tracking-[0.3em] debug-mono">
              <span className="w-8 h-px bg-white/10" />
              Audio Node
              <span className="w-8 h-px bg-white/10" />
            </div>
            <h1 className="text-2xl font-light text-white/90 tracking-wide headline">
              [ {song.title} ]
            </h1>
          </div>

          <div className="relative">
            <div className="absolute -inset-3 border border-white/4 pointer-events-none" />
            <div className="absolute -inset-1 border border-white/8 pointer-events-none" />
            
            <div className="bg-white/1.5 p-5">
              <AudioPlayer
                src={song.audioSrc}
                credits={song.credits}
                releaseDate={song.releaseDate}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-white/4" />
              <span className="text-white/25 text-[9px] uppercase tracking-[0.25em] debug-mono">
                Lyrical Data
              </span>
              <div className="h-px flex-1 bg-white/4" />
            </div>

            <div className="relative">
              <div className="absolute top-0 left-0 w-3 h-3 border-l border-t border-white/10" />
              <div className="absolute top-0 right-0 w-3 h-3 border-r border-t border-white/10" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-l border-b border-white/10" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-r border-b border-white/10" />
              
              <div className="bg-white/1 px-6 py-5">
                <pre className="text-white/55 text-[11px] leading-[1.8] whitespace-pre-wrap debug-mono">
                  {song.lyrics}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
